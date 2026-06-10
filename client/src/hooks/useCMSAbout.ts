import { useState, useEffect, useCallback } from "react";
import {
  aboutHero,
  aboutStory,
  aboutMission,
  aboutValues,
  aboutTimeline,
  aboutTeam,
  aboutAwards,
} from "@/mocks/aboutData";
import { useDataContext } from "@/context/DataContext";

type AboutHero     = typeof aboutHero;
type AboutStory    = typeof aboutStory;
type AboutMission  = typeof aboutMission;
type AboutValues   = typeof aboutValues;
type AboutTimeline = typeof aboutTimeline;
type AboutTeam     = typeof aboutTeam;
type AboutAwards   = typeof aboutAwards;

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
    resetAbout,
  } = useDataContext();

  const [hero, setHero]         = useState<AboutHero>(globalHero);
  const [story, setStory]        = useState<AboutStory>(globalStory);
  const [mission, setMission]    = useState<AboutMission>(globalMission);
  const [values, setValues]      = useState<AboutValues>(globalValues);
  const [timeline, setTimeline]  = useState<AboutTimeline>(globalTimeline);
  const [team, setTeam]          = useState<AboutTeam>(globalTeam);
  const [awards, setAwards]      = useState<AboutAwards>(globalAwards);
  
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
    hero: AboutHero;
    story: AboutStory;
    mission: AboutMission;
    values: AboutValues;
    timeline: AboutTimeline;
    team: AboutTeam;
    awards: AboutAwards;
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

  const updateHero     = useCallback((d: AboutHero)     => { setHero(d);     setHasChanges(true); }, []);
  const updateStory    = useCallback((d: AboutStory)    => { setStory(d);    setHasChanges(true); }, []);
  const updateMission  = useCallback((d: AboutMission)  => { setMission(d);  setHasChanges(true); }, []);
  const updateValues   = useCallback((d: AboutValues)   => { setValues(d);   setHasChanges(true); }, []);
  const updateTimeline = useCallback((d: AboutTimeline) => { setTimeline(d); setHasChanges(true); }, []);
  const updateTeam     = useCallback((d: AboutTeam)     => { setTeam(d);     setHasChanges(true); }, []);
  const updateAwards   = useCallback((d: AboutAwards)   => { setAwards(d);   setHasChanges(true); }, []);

  const reset = useCallback(() => {
    resetAbout();
    setHasChanges(false);
  }, [resetAbout]);

  return {
    hero, story, mission, values, timeline, team, awards,
    saveStatus, hasChanges,
    updateHero, updateStory, updateMission, updateValues, updateTimeline, updateTeam, updateAwards,
    save, reset,
  };
}
