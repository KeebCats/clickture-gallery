import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Gina from "../components/Icons/Gina";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import arrayMove from "../utils/arrayMove";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Gina Macro-Numpad | KeebCats</title>
        <meta
          property="og:image"
          content="https://gallery.gina.keebcats.co.uk/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://gallery.gina.keebcats.co.uk/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Gina />
              </span>
              <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black" />
            </div>
            <Logo />
            <h1 className="mt-8 mb-4 text-base font-bold tracking-widest">
              Gina by KeebCats
            </h1>
            <h2 className="mb-4 text-base tracking-widest">
              A highly versatile Macro-Numpad
            </h2>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              In collaboration with James AKB and Cutie Club, KeebCats proudly
              presents Gina - a Macro-Numpad that boasts multiple layouts
              designed to suit 60% and 65% form factors.
            </p>
            <Link
              className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
              href="https://forms.gle/sHePCAU6k5rgv6AS9"
              target="_blank"
              rel="noreferrer"
            >
              Register your interest!
            </Link>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight after:border-white/60 after:hover:border-white after:border-2"
            >
              <Image
                alt="Gina by KeebCats photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720,q_auto,f_auto/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        <a
          href="https://keebcats.co.uk/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          📸 by Hayden D. (drunken_sailor) - KeebCats {new Date().getFullYear()}
        </a>
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const allResults = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of allResults.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const ginaHeroImage = reducedResults.find(
    (r) => r.public_id === "gina/gina-hero"
  );
  const ginaQrCodeImage = reducedResults.find(
    (r) => r.public_id === "gina/gina-qr-code-image"
  );
  // push the QR code to index 14
  arrayMove(reducedResults, reducedResults.indexOf(ginaHeroImage), 0);
  arrayMove(reducedResults, reducedResults.indexOf(ginaQrCodeImage), 1);

  const blurImagePromises = allResults.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
