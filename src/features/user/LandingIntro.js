import TemplatePointers from "./components/TemplatePointers";

function LandingIntro() {
  return (
    <div
      className="hero min-h-full rounded-l-xl bg-base-200"
      style={{
        backgroundImage: `url("/GET STARTED.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-content py-12">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-bold">
            <img
              src="/logo192.png"
              className="w-12 inline-block mr-2 mask mask-circle"
              alt="dashwind-logo"
            />
            DashWind
          </h1>

          <div className="mt-12">
            <img
              src="./intro.png"
              alt="Dashwind Admin Template"
              className="w-48 inline-block"
            />
          </div>

          {/* Template Pointers Section */}
          <TemplatePointers />
        </div>
      </div>
    </div>
  );
}

export default LandingIntro;
