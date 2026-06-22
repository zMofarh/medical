import os
import re

src_dir = r"c:\Users\sloem\Desktop\New folder (3)\core\medical\client\src"

target_files = [
    r"pages\search\page.tsx",
    r"pages\packages\page.tsx",
    r"pages\packages\detail.tsx",
    r"pages\offers\page.tsx",
    r"pages\booking\confirmation.tsx",
    r"pages\booking\components\StepService.tsx",
    r"pages\booking\components\StepPatientInfo.tsx",
    r"pages\booking\components\StepDoctor.tsx",
    r"pages\booking\components\PackageSummaryBanner.tsx",
]

for rel_path in target_files:
    filepath = os.path.join(src_dir, rel_path)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove mock imports
    content = re.sub(r'import\s+\{[^}]*servicesData[^}]*\}\s+from\s+["\']@/mocks/servicesData["\'];?\n?', "", content)
    content = re.sub(r'import\s+\{[^}]*allPackages[^}]*\}\s+from\s+["\']@/mocks/packagesData["\'];?\n?', "", content)
    content = re.sub(r'import\s+\{[^}]*blogPosts[^}]*\}\s+from\s+["\']@/mocks/clinicData["\'];?\n?', "", content)
    # Remove types if imported from mocks that we moved
    content = re.sub(r'import\s+\{[^}]*MedicalPackage[^}]*\}\s+from\s+["\']@/mocks/packagesData["\'];?\n?', "", content)
    content = re.sub(r'import\s+\{[^}]*PackageCategory[^}]*\}\s+from\s+["\']@/mocks/packagesData["\'];?\n?', "", content)
    
    # Check if we need to add useDataContext import
    if "useDataContext" not in content and ("servicesData" in content or "allPackages" in content or "blogPosts" in content):
        content = "import { useDataContext } from \"@/context/DataContext\";\n" + content
        
    # Inject hook call inside the default export component
    # Find `export default function Component(...) {`
    match = re.search(r'export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{', content)
    if match:
        idx = match.end()
        hook_call = "\n  const { services: servicesData, packages: allPackages, posts: blogPosts } = useDataContext();\n"
        content = content[:idx] + hook_call + content[idx:]
        
    # For components not using export default (like StepService.tsx)
    match_named = re.search(r'export\s+function\s+\w+\s*\([^)]*\)\s*\{', content)
    if match_named and not match:
        idx = match_named.end()
        hook_call = "\n  const { services: servicesData, packages: allPackages, posts: blogPosts } = useDataContext();\n"
        content = content[:idx] + hook_call + content[idx:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Refactored {rel_path}")

