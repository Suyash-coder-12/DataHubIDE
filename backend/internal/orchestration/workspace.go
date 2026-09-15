package orchestration

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

type WorkspaceManager struct {
	dockerClient *client.Client
}

// Initialize the Docker client
func NewWorkspaceManager() (*WorkspaceManager, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, err
	}
	return &WorkspaceManager{dockerClient: cli}, nil
}

// CreateWorkspace provisions a new isolated Docker container for a user's project
func (m *WorkspaceManager) CreateWorkspace(ctx context.Context, userID, projectID string) (string, error) {
	containerName := fmt.Sprintf("workspace-%s-%s", userID, projectID)
	
	// Define container configuration
	config := &container.Config{
		Image: "cloud-ide-base:latest",
		Tty:   true, // Allocate a pseudo-TTY for Xterm.js integration
		Cmd:   []string{"/bin/bash"},
	}

	// Define host configuration (security & resource limits)
	hostConfig := &container.HostConfig{
		AutoRemove: true, // Automatically remove container when stopped
		Resources: container.Resources{
			Memory:   1024 * 1024 * 512, // 512MB RAM Limit
			NanoCPUs: 500000000,         // 0.5 CPU Core Limit
		},
	}

	// Create the container
	resp, err := m.dockerClient.ContainerCreate(ctx, config, hostConfig, nil, nil, containerName)
	if err != nil {
		return "", fmt.Errorf("failed to create workspace: %w", err)
	}

	// Start the container
	if err := m.dockerClient.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return "", fmt.Errorf("failed to start workspace: %w", err)
	}

	return resp.ID, nil // Return the active container ID
}

// DestroyWorkspace stops and removes the user's workspace
func (m *WorkspaceManager) DestroyWorkspace(ctx context.Context, containerID string) error {
	// Stop container (AutoRemove in HostConfig will delete it)
	return m.dockerClient.ContainerStop(ctx, containerID, container.StopOptions{})
}
