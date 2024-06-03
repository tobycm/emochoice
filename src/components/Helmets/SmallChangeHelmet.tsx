import { Helmet } from "react-helmet-async";

export default function SmallChangeHelmet({
  title,
  description,
  location,
  gallery = false,
}: {
  title: string;
  description: string;
  location: string;
  gallery?: boolean;
}) {
  return (
    <Helmet>
      {!gallery && <title>{title} - Emochoice</title>}
      <meta name="title" content={`${title} - Emochoice`} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://emochoice.ca/${location}`} />
      <meta property="og:title" content={`${title} - Emochoice`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://emochoice.ca/images/thumbnail.jpg" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://emochoice.ca/${location}`} />
      <meta property="twitter:title" content={`${title} - Emochoice`} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="https://emochoice.ca/images/thumbnail.jpg" />
    </Helmet>
  );
}
