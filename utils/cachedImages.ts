import arrayMove from "./arrayMove";
import cloudinary from "./cloudinary";

let cachedResults;

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    cachedResults = fetchedResults;
  }

  const ginaHeroImage = cachedResults.find(
    (r) => r.public_id === "gina/gina-hero"
  );
  const ginaQrCodeImage = cachedResults.find(
    (r) => r.public_id === "gina/gina-qr-code-image"
  );
  arrayMove(cachedResults, cachedResults.indexOf(ginaHeroImage), 0);
  arrayMove(cachedResults, cachedResults.indexOf(ginaQrCodeImage), 1);

  return cachedResults;
}
