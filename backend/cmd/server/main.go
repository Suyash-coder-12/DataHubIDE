package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

type RunRequest struct {
	Language string `json:"language"`
	Code     string `json:"code"`
}

type RunResponse struct {
	Output string `json:"output"`
	Error  string `json:"error,omitempty"`
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Godbolt API payload
type GodboltRequest struct {
	Source  string `json:"source"`
	Options struct {
		UserArguments     string `json:"userArguments"`
		ExecuteParameters struct {
			Args  []string `json:"args"`
			Stdin string   `json:"stdin"`
		} `json:"executeParameters"`
		CompilerOptions struct {
			ExecutorRequest bool `json:"executorRequest"`
		} `json:"compilerOptions"`
	} `json:"options"`
	Filters struct {
		Execute bool `json:"execute"`
	} `json:"filters"`
}

type GodboltResponse struct {
	Code   int `json:"code"`
	Stdout []struct {
		Text string `json:"text"`
	} `json:"stdout"`
	Stderr []struct {
		Text string `json:"text"`
	} `json:"stderr"`
	BuildResult *struct {
		Stderr []struct {
			Text string `json:"text"`
		} `json:"stderr"`
	} `json:"buildResult"`
}

func executeViaGodbolt(compilerID, code string) (string, error) {
	reqData := GodboltRequest{
		Source: code,
	}
	reqData.Options.UserArguments = ""
	reqData.Options.ExecuteParameters.Args = []string{}
	reqData.Options.ExecuteParameters.Stdin = ""
	reqData.Options.CompilerOptions.ExecutorRequest = true
	reqData.Filters.Execute = true

	reqBody, _ := json.Marshal(reqData)

	client := &http.Client{}
	req, _ := http.NewRequest("POST", "https://godbolt.org/api/compiler/"+compilerID+"/compile", bytes.NewBuffer(reqBody))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var gbResp GodboltResponse
	if err := json.Unmarshal(body, &gbResp); err != nil {
		return "", fmt.Errorf("invalid response from compiler API: %s", string(body))
	}

	var output string
	if gbResp.BuildResult != nil && len(gbResp.BuildResult.Stderr) > 0 {
		for _, line := range gbResp.BuildResult.Stderr {
			output += line.Text + "\n"
		}
	}
	if len(gbResp.Stderr) > 0 {
		for _, line := range gbResp.Stderr {
			output += line.Text + "\n"
		}
	}
	if len(gbResp.Stdout) > 0 {
		for _, line := range gbResp.Stdout {
			output += line.Text + "\n"
		}
	}

	return output, nil
}

func handleRunCode(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request", http.StatusBadRequest)
		return
	}

	var req RunRequest
	if err := json.Unmarshal(body, &req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Create temp directory for execution
	tmpDir, err := os.MkdirTemp("", "cloudide-*")
	if err != nil {
		http.Error(w, "Failed to create temp env", http.StatusInternalServerError)
		return
	}
	defer os.RemoveAll(tmpDir)

	var cmd *exec.Cmd
	var filename string

	switch req.Language {
	case "go":
		filename = filepath.Join(tmpDir, "main.go")
		if err := os.WriteFile(filename, []byte(req.Code), 0644); err != nil {
			http.Error(w, "Failed to write code", http.StatusInternalServerError)
			return
		}
		cmd = exec.Command("go", "run", filename)
	case "c":
		filename = filepath.Join(tmpDir, "main.c")
		if err := os.WriteFile(filename, []byte(req.Code), 0644); err != nil {
			http.Error(w, "Failed to write code", http.StatusInternalServerError)
			return
		}
		// Compile and run
		outBin := filepath.Join(tmpDir, "a.out.exe")
		buildCmd := exec.Command("gcc", filename, "-o", outBin)
		if buildErr, err := buildCmd.CombinedOutput(); err != nil {
			// Local compilation failed. Try Godbolt API as fallback (cg132 = gcc 13.2 for C).
			output, apiErr := executeViaGodbolt("cg132", req.Code)
			if apiErr != nil {
				msg := string(buildErr)
				if len(msg) == 0 {
					msg = err.Error() + "\n(Hint: 'gcc' is not installed locally, and fallback API failed: " + apiErr.Error() + ")"
				}
				resp := RunResponse{Output: msg}
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(resp)
				return
			}
			// API succeeded
			resp := RunResponse{Output: output}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(resp)
			return
		}
		cmd = exec.Command(outBin)
	case "cpp":
		filename = filepath.Join(tmpDir, "main.cpp")
		if err := os.WriteFile(filename, []byte(req.Code), 0644); err != nil {
			http.Error(w, "Failed to write code", http.StatusInternalServerError)
			return
		}
		// Compile and run
		outBin := filepath.Join(tmpDir, "a.out.exe")
		buildCmd := exec.Command("g++", filename, "-o", outBin)
		if buildErr, err := buildCmd.CombinedOutput(); err != nil {
			// Local compilation failed. Try Godbolt API as fallback (g132 = g++ 13.2 for C++).
			output, apiErr := executeViaGodbolt("g132", req.Code) 
			if apiErr != nil {
				msg := string(buildErr)
				if len(msg) == 0 {
					msg = err.Error() + "\n(Hint: 'g++' is not installed locally, and fallback API failed: " + apiErr.Error() + ")"
				}
				resp := RunResponse{Output: msg}
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(resp)
				return
			}
			// API succeeded
			resp := RunResponse{Output: output}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(resp)
			return
		}
		cmd = exec.Command(outBin)
	case "javascript":
		filename = filepath.Join(tmpDir, "script.js")
		if err := os.WriteFile(filename, []byte(req.Code), 0644); err != nil {
			http.Error(w, "Failed to write code", http.StatusInternalServerError)
			return
		}
		cmd = exec.Command("node", filename)
	case "python":
		filename = filepath.Join(tmpDir, "script.py")
		if err := os.WriteFile(filename, []byte(req.Code), 0644); err != nil {
			http.Error(w, "Failed to write code", http.StatusInternalServerError)
			return
		}
		cmd = exec.Command("python", filename)
	default:
		// Default to running as a bash script
		filename = filepath.Join(tmpDir, "script.sh")
		if err := os.WriteFile(filename, []byte(req.Code), 0644); err != nil {
			http.Error(w, "Failed to write code", http.StatusInternalServerError)
			return
		}
		cmd = exec.Command("bash", filename)
	}

	// Capture output
	output, err := cmd.CombinedOutput()
	
	resp := RunResponse{
		Output: string(output),
	}
	if err != nil {
		resp.Error = err.Error()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func main() {
	mux := http.NewServeMux()
	
	// API Route
	mux.HandleFunc("/api/run", handleRunCode)
	
	// Serve Next.js static files (output of npm run build)
	fsPath := "../frontend/out"
	if _, err := os.Stat(fsPath); os.IsNotExist(err) {
		fsPath = "./frontend/out" // Docker deployment path
	}
	mux.Handle("/", http.FileServer(http.Dir(fsPath)))
	
	handler := corsMiddleware(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Simplified Local Compiler Backend running on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
