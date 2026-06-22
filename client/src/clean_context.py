import os
import re
path = r"c:\Users\sloem\Desktop\New folder (3)\core\medical\client\src\context\DataContext.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# remove imports
content = re.sub(r'import\s+\{[^}]*\}\s+from\s+["\']@/mocks/testimonialsData["\'];?\n?', '', content)
content = re.sub(r'import\s+\{[^}]*\}\s+from\s+["\']@/mocks/cmsData["\'];?\n?', '', content)

# replace usages
content = content.replace('initialTestimonialsConfig', '{ autoplay: true, interval: 5000, showDots: true, showArrows: true }')
content = content.replace('initialTestimonialsStats', '[]')
content = content.replace('initialTestimonials', '[]')
content = content.replace('initialCmsContent', '[]')

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
