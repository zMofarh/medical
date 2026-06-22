import os
import re

src_dir = r"c:\Users\sloem\Desktop\New folder (3)\core\medical\client\src"

type_mapping = {
    "aboutHero": "AboutHeroData",
    "aboutStory": "AboutStoryData",
    "aboutMission": "AboutMission[]",
    "aboutValues": "AboutValue[]",
    "aboutTimeline": "AboutTimelineEvent[]",
    "aboutTeam": "AboutTeamMember[]",
    "aboutAwards": "AboutAward[]",
    
    "offersHeroData": "OffersHeroData",
    "seasonalOffersData": "SeasonalOffer[]",
    "flashDealsData": "FlashDeal[]",
    "howToRedeemSteps": "HowToRedeemStep[]",
    "offersNotifyData": "OffersNotifyData",
    
    "contactHero": "ContactHeroData",
    "contactMethods": "ContactMethod[]",
    "contactFormConfig": "ContactFormConfig",
    "contactMapConfig": "ContactMapConfig",
    "contactWorkingHours": "ContactWorkingHours",
    "contactSocialLinks": "ContactSocialLink[]",
    "contactCtaBanner": "ContactCtaBanner",
    "contactFaqTeaser": "ContactFaqTeaser",
    
    "searchHeroData": "SearchHeroData",
    "popularSearchesData": "PopularSearch[]",
    "quickLinksData": "QuickLink[]",
    "searchCTAData": "SearchCTAData",
    "searchResultsConfig": "SearchResultsConfig",
    "initialSearchResultsConfig": "SearchResultsConfig",
    
    "initialClinicInfo": "ClinicInfo",
    "initialWorkingHours": "WorkingHours",
    "initialSocialMedia": "SocialMedia",
    "initialEmergencyContact": "EmergencyContact",
    
    "clinicInfo": "ClinicInfo",
    "workingHours": "WorkingHours",
    "socialMedia": "SocialMedia",
    "emergencyContact": "EmergencyContact",
}

for root, dirs, files in os.walk(src_dir):
    for filename in files:
        if filename.endswith(".tsx") or filename.endswith(".ts"):
            if "mocks" in root:
                continue
                
            filepath = os.path.join(root, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                
            original_content = content
            
            # Find which mock types we are importing
            used_types = set()
            
            # Remove all mock imports
            mock_import_pattern = r'import\s+\{([^}]+)\}\s+from\s+["\']@/mocks/[^"\']+["\'];?\n?'
            def replacer(match):
                vars_imported = [v.strip() for v in match.group(1).split(",")]
                for v in vars_imported:
                    v_clean = v.split(" as ")[0].strip()
                    if v_clean in type_mapping:
                        base_type = type_mapping[v_clean].replace("[]", "")
                        used_types.add(base_type)
                    elif " as " in v:
                        v_alias = v.split(" as ")[1].strip()
                        if v_alias in type_mapping:
                            base_type = type_mapping[v_alias].replace("[]", "")
                            used_types.add(base_type)
                # We return empty string to remove the import
                return ""
            
            content = re.sub(mock_import_pattern, replacer, content)
            
            # Also handle default mock imports or full imports if any (unlikely based on grep)
            
            # Replace typeof usages
            for mock_var, type_name in type_mapping.items():
                content = re.sub(rf'\btypeof\s+{mock_var}\b', type_name, content)
            
            if used_types and content != original_content:
                # Add the new imports at the top (after other imports)
                import_statement = f"import {{ {', '.join(sorted(used_types))} }} from \"@/types/cms\";\n"
                # Find the last import statement
                last_import_idx = content.rfind("import ")
                if last_import_idx != -1:
                    end_of_last_import = content.find("\n", last_import_idx)
                    content = content[:end_of_last_import+1] + import_statement + content[end_of_last_import+1:]
                else:
                    content = import_statement + content
                    
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Refactored {filepath}")
