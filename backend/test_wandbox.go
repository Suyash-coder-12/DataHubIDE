package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

func main() {
	reqBody := `{"source":"#include <stdio.h>\nint main() { printf(\"Hello, World!\\n\"); return 0; }","options":{"userArguments":"","executeParameters":{"args":[],"stdin":""},"compilerOptions":{"executorRequest":true}},"filters":{"execute":true}}`
	client := &http.Client{}
	req, _ := http.NewRequest("POST", "https://godbolt.org/api/compiler/cg132/compile", bytes.NewBuffer([]byte(reqBody)))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("HTTP Error:", err)
		return
	}
	defer resp.Body.Close()
	
	body, _ := io.ReadAll(resp.Body)
	fmt.Println("Raw response:", string(body))
}
