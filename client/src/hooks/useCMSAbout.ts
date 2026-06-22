import { useState, useEffect, useCallback } from "react";
import { useDataContext } from "@/context/DataContext";
import { AboutAward, AboutHeroData, AboutMission, AboutStoryData, AboutTeamMember, AboutTimelineEvent, AboutValue } from "@/types/cms";

// ─── Public hook (read-only, reactive) ───────────────────────────────────────
export function usePublicAbout() {
  const {
    aboutHero: hero,
    aboutStory: story,
    aboutMission: mission,
    aboutValues: values,
    aboutTimeline: timeline,
    aboutTeam: team,
    aboutAwards: awards,
  } = useDataContext();

  return { hero, story, mission, values, timeline, team, awards };
}

// ─── Admin CMS hook (read + write) ───────────────────────────────────────────
export function useCMSAbout() {
  const {
    aboutHero: globalHero,
    aboutStory: globalStory,
    aboutMission: globalMission,
    aboutValues: globalValues,
    aboutTimeline: globalTimeline,
    aboutTeam: globalTeam,
    aboutAwards: globalAwards,
    saveAbout,
  } = useDataContext();

  const [hero, setHero]         = useState<AboutHeroData>(globalHero);
  const [story, setStory]        = useState<AboutStoryData>(globalStory);
  const [mission, setMission]    = useState<AboutMission[]>(globalMission);
  const [values, setValues]      = useState<AboutValue[]>(globalValues);
  const [timeline, setTimeline]  = useState<AboutTimelineEvent[]>(globalTimeline);
  const [team, setTeam]          = useState<AboutTeamMember[]>(globalTeam);
  const [awards, setAwards]      = useState<AboutAward[]>(globalAwards);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [hasChanges, setHasChanges] = useState(false);

  // Sync state with global state when changes happen
  useEffect(() => {
    setHero(globalHero);
    setStory(globalStory);
    setMission(globalMission);
    setValues(globalValues);
    setTimeline(globalTimeline);
    setTeam(globalTeam);
    setAwards(globalAwards);
  }, [globalHero, globalStory, globalMission, globalValues, globalTimeline, globalTeam, globalAwards]);

  const save = useCallback(async (data: {
    hero: AboutHeroData;
    story: AboutStoryData;
    mission: AboutMission[];
    values: AboutValue[];
    timeline: AboutTimelineEvent[];
    team: AboutTeamMember[];
    awards: AboutAward[];
  }) => {
    setSaveStatus("saving");
    try {
      await saveAbout(data);
      setSaveStatus("saved");
      setHasChanges(false);
      setTimeout(() => setSaveStatus("idle"), 2500);
      return { success: true };
    } catch (err) {
      setSaveStatus("error");
      return { success: false, error: err };
    }
  }, [saveAbout]);

  const updateHero     = useCallback((d: AboutHeroData)     => { setHero(d);     setHasChanges(true); }, []);
  const updateStory    = useCallback((d: AboutStoryData)    => { setStory(d);    setHasChanges(true); }, []);
  const updateMission  = useCallback((d: AboutMission[])  => { setMission(d);  setHasChanges(true); }, []);
  const updateValues   = useCallback((d: AboutValue[])   => { setValues(d);   setHasChanges(true); }, []);
  const updateTimeline = useCallback((d: AboutTimelineEvent[]) => { setTimeline(d); setHasChanges(true); }, []);
  const updateTeam     = useCallback((d: AboutTeamMember[])     => { setTeam(d);     setHasChanges(true); }, []);
  const updateAwards   = useCallback((d: AboutAward[])   => { setAwards(d);   setHasChanges(true); }, []);

  const reset = useCallback(() => {
    setHero(globalHero);
    setStory(globalStory);
    setMission(globalMission);
    setValues(globalValues);
    setTimeline(globalTimeline);
    setTeam(globalTeam);
    setAwards(globalAwards);
    setHasChanges(false);
  }, [globalHero, globalStory, globalMission, globalValues, globalTimeline, globalTeam, globalAwards]);

  return {
    hero, story, mission, values, timeline, team, awards,
    saveStatus, hasChanges,
    updateHero, updateStory, updateMission, updateValues, updateTimeline, updateTeam, updateAwards,
    save, reset,
  };
}
export type { AboutMission, AboutHeroData, AboutStoryData, AboutTeamMember, AboutTimelineEvent, AboutValue, AboutAward };
