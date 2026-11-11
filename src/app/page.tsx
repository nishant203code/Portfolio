import { AboutSkills, CredibilityStrip, ExperienceCards, Hero, ProjectWorks, ResearchList } from "@/components/home-sections";
import { ContactCTA } from "@/components/footer";
import { SystemStatus } from "@/components/system-status";

export default function Home() {
  return <div className="home-sections"><div className="introduction"><Hero /><CredibilityStrip /></div><AboutSkills /><ExperienceCards /><ProjectWorks /><ResearchList /><SystemStatus /><ContactCTA /></div>;
}
