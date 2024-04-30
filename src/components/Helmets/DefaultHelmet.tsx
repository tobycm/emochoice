import { Helmet } from "react-helmet-async";

const DefaultHelmet = () => {
  return (
    <Helmet>
      <meta name="title" content="Emochoice Canada - Print on Demand" />
      <meta
        name="description"
        content="Your top destination for emotionally impactful prints, offering a wide range of choices to bring your vision to life."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://emochoice.ca/" />
      <meta property="og:title" content="Emochoice Canada - Print on Demand" />
      <meta
        property="og:description"
        content="Your top destination for emotionally impactful prints, offering a wide range of choices to bring your vision to life."
      />
      <meta property="og:image" content="https://emochoice.ca/images/thumbnail.jpg" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://emochoice.ca/" />
      <meta property="twitter:title" content="Emochoice Canada - Print on Demand" />
      <meta
        property="twitter:description"
        content="Your top destination for emotionally impactful prints, offering a wide range of choices to bring your vision to life."
      />
      <meta property="twitter:image" content="https://emochoice.ca/images/thumbnail.jpg" />
    </Helmet>
  );
};

export default DefaultHelmet;
