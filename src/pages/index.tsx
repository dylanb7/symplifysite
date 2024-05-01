import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

export default function Home() {
  return (
    <div className="mx-4">
      <div className="mx-auto flex max-w-prose flex-col gap-4  py-12">
        <>
          <Label className="text-xl">Welcome to Symplify!</Label>
          <Separator />
        </>
        <p>
          At Symplify, we believe in empowering individuals to take control of
          their health and well-being. Our mission is to provide a
          user-friendly, intuitive, and efficient symptom diary app that helps
          people effortlessly track and manage their health conditions. We
          understand that life can be challenging when dealing with health
          issues, and keeping track of symptoms can be overwhelming. Our company
          aims to simplify the process by offering a seamless platform where
          users can easily record their symptoms, medications, and activities.
        </p>
        <>
          <Label className="text-xl">Key elements of our mission</Label>
          <Separator />
        </>
        <ul className="flex flex-col gap-8">
          <li>
            <b>Empowerment</b>
            <br />
            We strive to empower users by giving them the tools they need to
            actively participate in their healthcare journey. By keeping an
            accurate record of symptoms and health-related information, users
            can have more informed discussions with healthcare providers and
            make better decisions about their well-being.
          </li>
          <li>
            <b>Accessibility</b>
            <br />
            We are committed to making Symplify accessible to everyone. Our app
            is designed to be inclusive, user-friendly, and available on various
            platforms so that individuals from all walks of life can benefit
            from tracking their symptoms and health progress.
          </li>
          <li>
            <b>Data-Driven Insights</b>
            <br />
            Symplify goes beyond being just a symptom diary. We believe in the
            power of data to drive meaningful insights. Our app links
            deidentified user data to researchers who identify patterns,
            triggers, and correlations in symptoms, assisting users in
            understanding their conditions better.
          </li>
          <li>
            <b>Privacy and Security</b>
            <br />
            We prioritize the privacy and security of our users&apos data.
            Symplify follows strict data protection protocols and adheres to the
            highest industry standards to ensure that all personal information
            is kept safe and confidential.
          </li>
        </ul>
        <hr />
        <p>
          Join us in our mission to simplify the way you track, manage, and
          understand your health. Symplify is here to support you every step of
          the way. Together, let&aposs unlock the power of knowledge and take
          charge of our well-being!
        </p>
      </div>
    </div>
  );
}
