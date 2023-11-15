import { Helmet } from "react-helmet-async";

const SmallChangeHelmet = (props: { title: string; description: string; location: string; gallery: boolean }) => {
  return (
    <Helmet>
      {!props.gallery ? <title>{props.title} - Emochoice</title> : null}
      <meta name="title" content={`${props.title} - Emochoice`} />
      <meta name="description" content={props.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://v2.emochoice.ca/${props.location}`} />
      <meta property="og:title" content={`${props.title} - Emochoice`} />
      <meta property="og:description" content={props.description} />
      <meta property="og:image" content="https://v2.emochoice.ca/images/thumbnail.png" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://v2.emochoice.ca/${props.location}`} />
      <meta property="twitter:title" content={`${props.title} - Emochoice`} />
      <meta property="twitter:description" content={props.description} />
      <meta property="twitter:image" content="https://v2.emochoice.ca/images/thumbnail.png" />
    </Helmet>
  );
};

SmallChangeHelmet.defaultProps = {
  gallery: false,
};

export default SmallChangeHelmet;
