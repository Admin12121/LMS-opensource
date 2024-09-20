import ExplorePageContent from "../_components/explore-content";

const ExploreCategoryPage = async ({
  params,
}: {
  params: { category: string };
}) => {
  return <ExplorePageContent layout="LIST" category={params.category} />;
};

export default ExploreCategoryPage;
