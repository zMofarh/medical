import os
import glob
import re

api_dir = r"c:\Users\sloem\Desktop\New folder (3)\core\medical\client\src\api"

for filepath in glob.glob(os.path.join(api_dir, "*.ts")):
    filename = os.path.basename(filepath)
    if filename in ["config.ts", "auth.ts", "blog.ts"]:
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the broken LOCAL_API_URL
    # const LOCAL_API_URL = ${API_BASE_URL}/cms/home;
    pattern = r"import \{ API_BASE_URL \} from '\./config';\nconst LOCAL_API_URL = \$\{API_BASE_URL\}/([^;]+);"
    
    match = re.search(pattern, content)
    if match:
        endpoint = match.group(1)
        # Fix the top
        content = re.sub(pattern, f"import {{ API_BASE_URL }} from './config';\nconst LOCAL_API_URL = `${{API_BASE_URL}}/{endpoint}`;", content)
        # Replace API_BASE_URL with LOCAL_API_URL in fetches
        content = content.replace("`${API_BASE_URL}", "`${LOCAL_API_URL}")
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Fixed {filename}")

