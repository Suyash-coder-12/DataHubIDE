FROM ubuntu:22.04

# Avoid prompts during apt installations
ENV DEBIAN_FRONTEND=noninteractive

# 1. Install core development tools & compilers
RUN apt-get update && apt-get install -y \
    curl wget git sudo build-essential cmake \
    # Web Dev
    nodejs npm \
    # Python & Scientific tools
    python3 python3-pip \
    # Hardware/Engineering tools (Simulators/Octave)
    octave \
    # Language Servers
    clangd \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Engineering Student Tools (Jupyter, Solvers)
RUN pip3 install jupyter numpy scipy matplotlib

# 3. Create a non-root developer user (Security best practice)
# We configure sudo without password for 'root terminal access' feature
RUN useradd -ms /bin/bash developer && \
    echo "developer ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER developer
WORKDIR /workspace

# 4. Expose standard ports for web dev servers (e.g., React, Express)
EXPOSE 3000 8080

# Keep the container alive (Orchestrator will connect to it via Exec)
CMD ["tail", "-f", "/dev/null"]
