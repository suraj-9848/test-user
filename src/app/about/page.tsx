import React from "react";
import AboutHeader from "@/components/about/AboutHeader";
import OurMission from "@/components/about/OurMission";
import OurTeam from "@/components/about/OurTeam";
import OurValues from "@/components/about/OurValues";
import OurJourney from "@/components/about/OurJourney";

const AboutPage = () => {
  return (
    <div>
      <AboutHeader />
      <OurMission />
      <OurValues />
      <OurTeam />
      <OurJourney />
    </div>
  );
};

export default AboutPage;
