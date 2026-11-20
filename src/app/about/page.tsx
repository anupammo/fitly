import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About, Privacy & Medical Disclaimer",
  description: "Who we are, how Fitly handles your data, and our medical disclaimer.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="prose">
      <h1>About Fitly</h1>
      <p>
        Fitly helps people in India build healthier daily habits with free tools, an Indian food calorie database and plain-language
        health articles.
      </p>
      <h2>Medical disclaimer</h2>
      <p>
        Content and calculators on Fitly are for general information only. They are not medical advice, diagnosis or treatment. Always
        consult a qualified doctor or registered dietitian about your health, especially if you are pregnant, have a medical condition or
        take medication.
      </p>
      <h2>Editorial standards</h2>
      <p>
        Health articles show a named medical reviewer once reviewed. Articles awaiting review carry a notice and are not submitted to
        search engines. Food values are marked approximate until our dietitian panel verifies them against IFCT 2017 data.
      </p>
      <h2>Your data</h2>
      <p>
        The daily tracker currently stores your entries only in your own browser on your device. We do not receive or sell them. Clearing
        your browser data deletes them. When accounts launch, we will ask for your consent before storing health data, in line with
        India&apos;s Digital Personal Data Protection Act, 2023.
      </p>
    </div>
  );
}
