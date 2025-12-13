# pNode Update Guide

This guide explains how to update your Xandeum pNode to the latest version.

## Prerequisites

- SSH access to your pNode
- SSH identity file (id_ed25519)
- Root access on the pNode

## Step 1: Connect to Your pNode via SSH

You need to forward the necessary ports to access the pNode services locally.

### Windows (PowerShell or CMD)

```powershell
ssh -i "C:\path\to\ssh\key\id_ed25519" root@<my.p.node.ip> -L 4000:localhost:4000 -L 3000:localhost:3000 -L 8000:localhost:8000
```

**Important Notes:**
- Replace `C:\path\to\ssh\key\id_ed25519` with the actual path to your SSH private key
- Replace `<my.p.node.ip>` with your pNode's public IP address
- Use the private key file (id_ed25519), not the public key (id_ed25519.pub)

### Mac/Linux Terminal

```bash
ssh -i ~/.ssh/id_ed25519 root@<my.p.node.ip> -L 4000:localhost:4000 -L 3000:localhost:3000 -L 8000:localhost:8000
```

**Important Notes:**
- Replace `~/.ssh/id_ed25519` with the actual path to your SSH private key if different
- Replace `<my.p.node.ip>` with your pNode's public IP address

### Port Forwarding Explanation

- **Port 4000**: Xandminerd service
- **Port 3000**: Web GUI (Xandminer dashboard)
- **Port 8000**: Additional service (if needed)

## Step 2: Switch to Root User

Once connected via SSH, switch to the root user:

```bash
sudo -i
```

You may be prompted for the sudo password.

## Step 3: Run the Update Script

Download and execute the latest install script:

```bash
wget -O install.sh "https://raw.githubusercontent.com/Xandeum/xandminer-installer/refs/heads/master/install.sh" && chmod a+x install.sh && ./install.sh
```

## Step 4: Select Upgrade Option

When the script runs, select **Option 2** to upgrade your pNode.

## Step 5: Wait for Completion

The upgrade process may take several minutes. Wait for the completion messages:

```
Xandminerd Service Running On Port : 4000
To access your Xandminer, use address localhost:3000 in your web browser
Setup completed successfully!
Upgrade completed successfully!
Restarting Xandeum service...
Service restart completed.
```

## Step 6: Verify the Update

1. Open your local web browser
2. Navigate to: `http://localhost:3000/`
3. Check the Xandminer status in the web GUI to confirm the update was successful

## Troubleshooting

### SSH Connection Issues

- Verify your SSH key path is correct
- Ensure your pNode's IP address is correct
- Check that your firewall allows SSH connections (port 22)
- Verify the SSH key has the correct permissions (chmod 600 on Linux/Mac)

### Port Forwarding Issues

- Ensure ports 3000, 4000, and 8000 are not already in use on your local machine
- Check that the pNode services are running on those ports
- Try using different local ports if conflicts occur:
  ```bash
  ssh -i ~/.ssh/id_ed25519 root@<my.p.node.ip> -L 4001:localhost:4000 -L 3001:localhost:3000 -L 8001:localhost:8000
  ```
  Then access the GUI at `http://localhost:3001/`

### Update Script Issues

- Ensure you have root privileges
- Check your internet connection
- Verify the GitHub repository is accessible
- Review the script output for specific error messages

## Additional Resources

- [Xandeum Discord](https://discord.gg/uqRSmmM5m) - For support and updates
- [Xandeum Network](https://xandeum.network) - Official website and documentation

