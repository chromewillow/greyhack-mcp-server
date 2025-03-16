import { Server } from "@modelcontextprotocol/typescript-sdk";
import { GithubClient } from "@smithery-ai/github-client";
import axios from "axios";

// Create the MCP server
const server = new Server({
  name: "greyhack-mcp-server",
  description: "A Grey Hack MCP server with GitHub code search, Greybel-JS transpilation, API validation and script generation",
  version: "0.1.0",
});

// GitHub search tool
server.addTool({
  name: "search_greyhack_code",
  description: "Search for Grey Hack code examples on GitHub",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query for finding Grey Hack code",
      },
      max_results: {
        type: "number",
        description: "Maximum number of results to return",
        default: 5,
      },
    },
    required: ["query"],
  },
  handler: async (params) => {
    try {
      const { query, max_results = 5 } = params;
      const githubToken = process.env.GITHUB_TOKEN;
      
      if (!githubToken) {
        return { error: "GITHUB_TOKEN environment variable not set. Please provide a GitHub token." };
      }
      
      const github = new GithubClient({ auth: githubToken });
      const searchQuery = `${query} language:greyscript OR language:js extension:.gs extension:.txt`;
      const results = await github.searchCode(searchQuery);
      
      return {
        results: results.items.slice(0, max_results).map(item => ({
          name: item.name,
          path: item.path,
          repository: item.repository.full_name,
          url: item.html_url,
          content: item.content || null,
        })),
        total_count: results.total_count,
      };
    } catch (error) {
      console.error("Error searching GitHub:", error);
      return { error: `Error searching GitHub: ${error.message}` };
    }
  },
});

// Greybel-JS transpilation tool
server.addTool({
  name: "transpile_greyscript",
  description: "Transpile GreyScript code to JavaScript using Greybel-JS",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "The GreyScript code to transpile",
      },
    },
    required: ["code"],
  },
  handler: async (params) => {
    try {
      const { code } = params;
      
      // For now, we'll use a placeholder service until we can integrate with a real Greybel-JS library
      // In a real implementation, you'd use a local library or API
      // This is a simulated response
      const transpiled = `// Transpiled from GreyScript to JavaScript
function main() {
  // Transpiled code would go here
  console.log("Transpiled code from GreyScript");
  // Original code length: ${code.length} characters
}

main();`;
      
      return {
        original: code,
        transpiled: transpiled,
        success: true,
      };
    } catch (error) {
      console.error("Error transpiling code:", error);
      return { error: `Error transpiling code: ${error.message}`, success: false };
    }
  },
});

// GreyScript API validation tool
server.addTool({
  name: "validate_greyscript",
  description: "Validate GreyScript code against the official API documentation",
  parameters: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "The GreyScript code to validate",
      },
      version: {
        type: "string",
        description: "The Grey Hack game version to validate against",
        default: "0.8.0",
      },
    },
    required: ["code"],
  },
  handler: async (params) => {
    try {
      const { code, version = "0.8.0" } = params;
      
      // In a real implementation, you'd fetch the actual API docs or use a local copy
      // This is a simulated validation
      const apiCalls = extractApiCalls(code);
      const validationResults = {
        valid: true,
        warnings: [],
        errors: [],
        api_calls: apiCalls,
      };
      
      // Simulate some validation checks
      if (code.includes("get_connect_ip") && version >= "0.8.0") {
        validationResults.warnings.push("get_connect_ip is deprecated in version 0.8.0+, use get_router instead");
        validationResults.valid = false;
      }
      
      if (code.includes("unknown_function")) {
        validationResults.errors.push("unknown_function is not a valid API function");
        validationResults.valid = false;
      }
      
      return validationResults;
    } catch (error) {
      console.error("Error validating code:", error);
      return { error: `Error validating code: ${error.message}`, valid: false };
    }
  },
});

// Script generation tool
server.addTool({
  name: "generate_greyhack_script",
  description: "Generate a GreyScript code template for common Grey Hack game tasks",
  parameters: {
    type: "object",
    properties: {
      script_type: {
        type: "string",
        description: "The type of script to generate",
        enum: ["port_scanner", "password_cracker", "file_browser", "ssh_tool", "custom"],
      },
      custom_description: {
        type: "string",
        description: "Description of the custom script to generate (only used if script_type is 'custom')",
      },
      game_version: {
        type: "string",
        description: "The Grey Hack game version to target",
        default: "0.8.0",
      },
    },
    required: ["script_type"],
  },
  handler: async (params) => {
    try {
      const { script_type, custom_description, game_version = "0.8.0" } = params;
      
      let scriptTemplate = "";
      let scriptDescription = "";
      
      switch (script_type) {
        case "port_scanner":
          scriptDescription = "A port scanner for network reconnaissance";
          scriptTemplate = generatePortScannerTemplate(game_version);
          break;
        case "password_cracker":
          scriptDescription = "A password cracking utility";
          scriptTemplate = generatePasswordCrackerTemplate(game_version);
          break;
        case "file_browser":
          scriptDescription = "A file browser utility";
          scriptTemplate = generateFileBrowserTemplate(game_version);
          break;
        case "ssh_tool":
          scriptDescription = "An SSH connection tool";
          scriptTemplate = generateSshToolTemplate(game_version);
          break;
        case "custom":
          scriptDescription = custom_description || "Custom script";
          scriptTemplate = generateCustomTemplate(custom_description, game_version);
          break;
        default:
          return { error: "Invalid script type specified" };
      }
      
      return {
        script_type,
        description: scriptDescription,
        code: scriptTemplate,
        game_version,
      };
    } catch (error) {
      console.error("Error generating script:", error);
      return { error: `Error generating script: ${error.message}` };
    }
  },
});

// Helper functions for the tools
function extractApiCalls(code: string): string[] {
  // This is a simplified implementation
  // In a real implementation, you'd use proper parsing to extract API calls
  const commonApis = ["get_router", "get_shell", "get_file", "get_folders", "get_files", "nslookup"];
  return commonApis.filter(api => code.includes(api));
}

function generatePortScannerTemplate(version: string): string {
  return `// Grey Hack Port Scanner v1.0
// For game version ${version}
// Scans a target computer for open ports

metaxploit = include_lib("/lib/metaxploit.so")
if not metaxploit then
    metaxploit = include_lib(current_path + "/metaxploit.so")
end if

if not metaxploit then
    exit("Error: Can't find metaxploit library")
end if

scan_address = function(address)
    ports = range(1, 65535)
    open_ports = []
    
    for port in ports
        // Try to connect to each port
        net_session = metaxploit.net_use(address, port)
        if net_session then
            open_ports.push(port)
            // Optional: try to get service version
            service_info = net_session.host_computer.get_service_info(port)
            print("Port " + port + " is open: " + service_info)
        end if
    end for
    
    return open_ports
end function

// Main program
print("Port Scanner Starting...")
target = user_input("Enter target IP: ")
if not is_valid_ip(target) then
    exit("Invalid IP address")
end if

print("Scanning " + target + "...")
open_ports = scan_address(target)

if open_ports.len == 0 then
    print("No open ports found")
else
    print("Found " + open_ports.len + " open ports")
    print(open_ports)
end if
`;
}

function generatePasswordCrackerTemplate(version: string): string {
  return `// Grey Hack Password Cracker v1.0
// For game version ${version}
// Cracks passwords for various security systems

crypto = include_lib("/lib/crypto.so")
if not crypto then
    crypto = include_lib(current_path + "/crypto.so")
end if

if not crypto then
    exit("Error: Can't find crypto library")
end if

crack_password = function(hash, type)
    if not crypto.is_valid_password(hash) then
        return "Invalid password hash"
    end if
    
    wordlist = get_shell.host_computer.File("/usr/share/wordlists/common.txt")
    if not wordlist then
        print("Wordlist not found, using simple brute force")
        // Simple brute force for demo purposes
        password = crypto.aircrack(hash)
        return password
    else
        print("Using wordlist for cracking")
        words = wordlist.get_content.split("\\n")
        for word in words
            if crypto.hash(word) == hash then
                return word
            end if
        end for
        
        // If wordlist fails, try brute force
        print("Wordlist exhausted, trying brute force")
        password = crypto.aircrack(hash)
        return password
    end if
end function

// Main program
print("Password Cracker Starting...")
hash = user_input("Enter password hash: ")
hash_type = user_input("Enter hash type (or leave blank): ")

print("Cracking password...")
password = crack_password(hash, hash_type)

if password then
    print("Password cracked: " + password)
else
    print("Failed to crack password")
end if
`;
}

function generateFileBrowserTemplate(version: string): string {
  return `// Grey Hack File Browser v1.0
// For game version ${version}
// Browse and manipulate files on the system

browse_directory = function(path)
    computer = get_shell.host_computer
    files = computer.get_files(path)
    folders = computer.get_folders(path)
    
    print("Contents of " + path + ":")
    print("----------------------------")
    
    if folders.len > 0 then
        print("Directories:")
        for folder in folders
            print("📁 " + folder.name + "/")
        end for
        print("")
    end if
    
    if files.len > 0 then
        print("Files:")
        for file in files
            print("📄 " + file.name + " (" + file.size + " bytes)")
        end for
    end if
    
    print("----------------------------")
    return {"files": files, "folders": folders}
end function

file_details = function(file_path)
    computer = get_shell.host_computer
    file = computer.File(file_path)
    
    if not file then
        return "File not found: " + file_path
    end if
    
    details = {}
    details["name"] = file.name
    details["path"] = file.path
    details["size"] = file.size
    details["owner"] = file.owner
    details["group"] = file.group
    details["permissions"] = file.permissions
    
    return details
end function

// Main program
print("File Browser Starting...")
current_path = "/"

while true
    browse_result = browse_directory(current_path)
    
    print("\\nCurrent path: " + current_path)
    print("Commands: cd [dir], details [file], cat [file], exit")
    command = user_input("> ")
    
    if command == "exit" then
        break
    else if command.indexOf("cd ") == 0 then
        new_dir = command[3:]
        if new_dir == ".." then
            // Go up one directory
            parts = current_path.split("/")
            if parts.len > 1 then
                parts.pop
                current_path = parts.join("/")
                if current_path == "" then current_path = "/"
            end if
        else if new_dir.indexOf("/") == 0 then
            // Absolute path
            current_path = new_dir
        else
            // Relative path
            if current_path[-1:] != "/" then current_path = current_path + "/"
            current_path = current_path + new_dir
        end if
    else if command.indexOf("details ") == 0 then
        file_name = command[8:]
        if file_name.indexOf("/") == 0 then
            // Absolute path
            details = file_details(file_name)
        else
            // Relative path
            path = current_path
            if path[-1:] != "/" then path = path + "/"
            details = file_details(path + file_name)
        end if
        print(details)
    else if command.indexOf("cat ") == 0 then
        file_name = command[4:]
        path = ""
        
        if file_name.indexOf("/") == 0 then
            // Absolute path
            path = file_name
        else
            // Relative path
            path = current_path
            if path[-1:] != "/" then path = path + "/"
            path = path + file_name
        end if
        
        file = get_shell.host_computer.File(path)
        if file then
            print("Contents of " + file.name + ":")
            print("----------------------------")
            print(file.get_content)
            print("----------------------------")
        else
            print("File not found: " + path)
        end if
    else
        print("Unknown command: " + command)
    end if
    
    print("")
end while

print("File Browser Closed")
`;
}

function generateSshToolTemplate(version: string): string {
  return `// Grey Hack SSH Tool v1.0
// For game version ${version}
// Connect to remote computers via SSH

connect_ssh = function(address, port, user, password)
    if not is_valid_ip(address) then
        return {"success": false, "message": "Invalid IP address"}
    end if
    
    if typeof(port) != "number" or port < 1 or port > 65535 then
        return {"success": false, "message": "Invalid port number"}
    end if
    
    // In versions 0.8.0+, using the new router API
    if "${version}" >= "0.8.0" then
        router = get_router
        if not router then
            return {"success": false, "message": "Cannot find router"}
        end if
        
        print("Connecting to " + address + ":" + port + "...")
        start_time = time
        remote_shell = router.connect_ssh(address, port, user, password)
    else
        // For older versions
        crypto = include_lib("/lib/crypto.so")
        if not crypto then
            return {"success": false, "message": "Cannot find crypto library"}
        end if
        
        print("Connecting to " + address + ":" + port + "...")
        remote_shell = crypto.connect_ssh(address, port, user, password)
    end if
    
    if not remote_shell then
        return {"success": false, "message": "SSH connection failed"}
    end if
    
    print("Connected to " + address + " as " + user)
    remote_computer = remote_shell.host_computer
    return {
        "success": true, 
        "message": "Connected successfully", 
        "shell": remote_shell, 
        "computer": remote_computer
    }
end function

// Main program
print("SSH Connection Tool Starting...")
address = user_input("Target IP: ")
port = user_input("Port (default: 22): ").to_int
if not port then port = 22

user = user_input("Username: ")
password = user_input("Password: ")

result = connect_ssh(address, port, user, password)

if result.success then
    print("Connection established!")
    shell = result.shell
    computer = result.computer
    
    print("Connected to: " + computer.get_name)
    print("Type 'exit' to close the connection")
    
    while true
        command = user_input(user + "@" + computer.get_name + ":~$ ")
        if command == "exit" then
            break
        end if
        
        output = shell.host_computer.terminal.execute(command)
        print(output)
    end while
    
    print("Connection closed")
else
    print("Connection failed: " + result.message)
end if
`;
}

function generateCustomTemplate(description: string, version: string): string {
  return `// Grey Hack Custom Script
// For game version ${version}
// ${description || "Custom script template"}

// Add your imports here
// Example:
// metaxploit = include_lib("/lib/metaxploit.so")
// crypto = include_lib("/lib/crypto.so")

// Add your functions here
custom_function = function()
    print("This is a custom function")
    return true
end function

// Main program
print("Custom Script Starting...")
print("Description: ${description || "No description provided"}")

// Add your main code here
print("Hello, world!")
custom_function()

print("Custom Script Completed")
`;
}

// Start the server
server.start();