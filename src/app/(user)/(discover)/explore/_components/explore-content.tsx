"use client"
// import dynamic from "next/dynamic"
// import ExploreSlider from "./explore-slider"
import GroupList from "./group-list"

type Props = {
  layout: "SLIDER" | "LIST"
  category?: string
}

const ExplorePageContent = ({ layout, category }: Props) => {
  return (
    <div className="flex flex-col">
{/* 
        (layout === "SLIDER" ? (
          <>
            <ExploreSlider
              label="Fitness"
              text="Join top performing groups on grouple."
              query="fitness"
            />
            <ExploreSlider
              label="Lifestyle"
              text="Join top performing groups on grouple."
              query="lifestyle"
            />
            <ExploreSlider
              label="Music"
              text="Join top performing groups on grouple."
              query="music"
            />
          </>
        ) : (
          <GroupList category={category as string} />
          )) */}
          <GroupList category={category as string} />
    </div>
  )
}

export default ExplorePageContent
