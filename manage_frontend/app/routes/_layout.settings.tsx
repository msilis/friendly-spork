import { useState } from "react";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { getSettings, saveSettings } from "~/data/data";
import { useToast } from "~/hooks/hooks";

export const loader = async () => {
  try {
    const settings = await getSettings();
    return Response.json({ settings });
  } catch (error) {
    console.error("There was an error getting info from the database: ", error);
    return Response.json(
      {
        message:
          "Sorry, there was an error getting info from the databae. Please try again later.",
      },
      { status: 500 }
    );
  }
};

type SettingsType = {
  settings_key: string;
  settings_value: string;
};

const Settings = () => {
  const { settings, message } = useLoaderData<{
    settings?: SettingsType[];
    message?: string;
  }>();

  const revalidator = useRevalidator();
  const toast = useToast();
  const errorMessage = message;

  const settingsMap = settings?.reduce<Record<string, string>>(
    (acc, { settings_key, settings_value }) => {
      acc[settings_key] = settings_value;
      return acc;
    },
    {}
  );

  const [termDateFormState, setTermDateFormState] = useState({});
  const [halftermFormState, setHalftermFormState] = useState({});

  const handleTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTermDateFormState({ ...termDateFormState, [name]: value });
  };

  const handleHalfTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setHalftermFormState({ ...halftermFormState, [name]: value });
  };

  const handleSaveTermDateSettings = async () => {
    const settingsArray = Object.entries(termDateFormState).map(
      ([key, value]) => ({
        settings_key: key,
        settings_value: value,
      })
    );
    await saveSettings(settingsArray);
    revalidator.revalidate();
    toast.success("Term dates saved");
  };

  const handleHalfTermSave = async () => {
    const halfTermArray = Object.entries(halftermFormState).map(
      ([key, value]) => ({
        settings_key: key,
        settings_value: value,
      })
    );

    await saveSettings(halfTermArray);
    revalidator.revalidate();
    toast.success("Half-term dates saved");
  };

  const savePriceSetting = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event?.target as HTMLButtonElement;
    const input = button?.previousElementSibling as HTMLInputElement;
    const name = input?.name;
    const value = input?.value;
    const priceToSave = [{ settings_key: name, settings_value: value }];
    await saveSettings(priceToSave);
    input.value = "";
    revalidator.revalidate();
  };

  if (errorMessage) {
    return (
      <div className="alert alert-error w-5/6 mt-8">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className="w-6 h-6 stroke-current mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          ></path>
        </svg>
        <span>{errorMessage}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-4 ml-8">
        <h2 className="font-bold mb-2">Term dates</h2>
        <div className="h-1 border-2 border-black mr-4"></div>
        <div className="flex gap-5 mt-2 mb-2 md:flex-col">
          <div
            className="bg-base-300 p-3 flex flex-col gap-2 rounded-box"
            style={{ minWidth: "300px" }}
          >
            <h2 className="font-bold">Set Term Dates</h2>
            <label htmlFor="term1_start_date">Term 1 Start Date</label>
            <input
              id="term1_start_date"
              name="term1_start_date"
              type="date"
              defaultValue={settingsMap?.["term1_start_date"] || ""}
              className="bg-base-300"
              onChange={handleTermChange}
            />
            <label htmlFor="term2_end_date">Term 1 End Date</label>
            <input
              id="term1_end_date"
              name="term1_end_date"
              type="date"
              className="bg-base-300"
              defaultValue={settingsMap?.["term1_end_date"] || ""}
              onChange={handleTermChange}
            />
            <label htmlFor="term2_end_date">Term 2 Start Date</label>
            <input
              id="term2_start_date"
              name="term2_start_date"
              type="date"
              className="bg-base-300"
              defaultValue={settingsMap?.["term2_start_date"] || ""}
              onChange={handleTermChange}
            />
            <label htmlFor="term2_end_date">Term 2 End Date</label>
            <input
              id="term2_end_date"
              name="term2_end_date"
              type="date"
              className="bg-base-300"
              defaultValue={settingsMap?.["term2_end_date"] || ""}
              onChange={handleTermChange}
            />
            <label htmlFor="term3_start_date">Term 3 Start Date</label>
            <input
              id="term3_start_date"
              name="term3_start_date"
              type="date"
              className="bg-base-300"
              defaultValue={settingsMap?.["term3_start_date"] || ""}
              onChange={handleTermChange}
            />
            <label htmlFor="term3_end_date">Term 3 End Date</label>
            <input
              id="term3_end_date"
              name="term3_end_date"
              type="date"
              className="bg-base-300"
              defaultValue={settingsMap?.["term3_end_date"] || ""}
              onChange={handleTermChange}
            />
            <button
              className="btn btn-accent"
              onClick={handleSaveTermDateSettings}
            >
              Save
            </button>
          </div>
          <div
            className="bg-base-300 p-3 flex flex-col gap-2 rounded-box"
            style={{ minWidth: "300px" }}
          >
            <h2 className="font-bold">Set Half-Term Dates</h2>
            <label htmlFor="term1_halfterm_startdate">
              Term 1 Half-term Start Date
            </label>
            <input
              id="term1_halfterm_startdate"
              name="term1_halfterm_startdate"
              defaultValue={settingsMap?.["term1_halfterm_startdate"] || ""}
              type="date"
              className="bg-base-300"
              onChange={handleHalfTermChange}
            />
            <label htmlFor="term1_halfterm_enddate">
              Term 1 Half-term End Date
            </label>
            <input
              id="term1_halfterm_enddate"
              name="term1_halfterm_enddate"
              defaultValue={settingsMap?.["term1_halfterm_enddate"] || ""}
              type="date"
              className="bg-base-300"
              onChange={handleHalfTermChange}
            />
            <label htmlFor="term1_halfterm_startdate">
              Term 2 Half-term Start Date
            </label>
            <input
              id="term2_halfterm_startdate"
              name="term2_halfterm_startdate"
              defaultValue={settingsMap?.["term2_halfterm_startdate"] || ""}
              type="date"
              className="bg-base-300"
              onChange={handleHalfTermChange}
            />
            <label htmlFor="term2_halfterm_enddate">
              Term 2 Half-term End Date
            </label>
            <input
              id="term2_halfterm_enddate"
              name="term2_halfterm_enddate"
              defaultValue={settingsMap?.["term2_halfterm_enddate"] || ""}
              type="date"
              className="bg-base-300"
              onChange={handleHalfTermChange}
            />
            <label htmlFor="term1_halfterm_startdate">
              Term 3 Half-term Start Date
            </label>
            <input
              id="term3_halfterm_startdate"
              name="term3_halfterm_startdate"
              defaultValue={settingsMap?.["term3_halfterm_startdate"] || ""}
              type="date"
              className="bg-base-300"
              onChange={handleHalfTermChange}
            />
            <label htmlFor="term3_halfterm_enddate">
              Term 1 Half-term End Date
            </label>
            <input
              id="term3_halfterm_enddate"
              name="term3_halfterm_enddate"
              defaultValue={settingsMap?.["term3_halfterm_enddate"] || ""}
              type="date"
              className="bg-base-300"
              onChange={handleHalfTermChange}
            />
            <button className="btn btn-accent" onClick={handleHalfTermSave}>
              Save
            </button>
          </div>
        </div>
        <h2 className="mt-2 mb-2 font-bold">Rates</h2>
        <div className="h-1 border-2 border-black mr-4"></div>
        <section className="flex gap-4 mt-4 lg:flex-col">
          <div className="flex flex-col gap-2 border-2 p-2 rounded-box">
            <label htmlFor="per_student_price">Price per student</label>
            <input
              className="input input-bordered w-fit"
              name="per_student_price"
              type="number"
              placeholder="£"
            />
            <button
              className="btn btn-success btn-xs w-fit"
              onClick={savePriceSetting}
            >
              Save
            </button>
          </div>
          <div className="flex flex-col gap-2 border-2 p-2 rounded-box">
            <h3>Current amount </h3>
            <h2 className="font-bold text-center text-xl">
              {settingsMap?.["per_student_price"]
                ? `£${settingsMap?.["per_student_price"]}`
                : "£0"}
            </h2>
            <h3 className="text-center">per term</h3>
          </div>
          <div className="flex flex-col gap-2 border-2 p-2 rounded-box">
            <label htmlFor="theory_price">Theory Price</label>
            <input
              className="input input-bordered w-fit"
              type="number"
              name="theory_price"
              placeholder="£"
            />
            <button
              className="btn btn-success btn-xs w-fit"
              onClick={savePriceSetting}
            >
              Save
            </button>
          </div>
          <div className="flex flex-col gap-2 border-2 p-2 rounded-box">
            <h3>Current amount </h3>
            <h2 className="font-bold text-center text-xl">
              {settingsMap?.["theory_price"]
                ? `£${settingsMap["theory_price"]}`
                : "£0"}
            </h2>
            <h3 className="text-center">per term</h3>
          </div>
          <div className="flex flex-col gap-2 border-2 p-2 rounded-box">
            <label htmlFor="sibling_discount">Sibling Discount</label>
            <input
              className="input input-bordered w-fit"
              type="number"
              name="sibling_discount"
              placeholder="%"
            />
            <button
              className="btn btn-success btn-xs w-fit"
              onClick={savePriceSetting}
            >
              Save
            </button>
          </div>
          <div className="flex flex-col gap-2 border-2 p-2 rounded-box">
            <h3>Current discount </h3>
            <h2 className="font-bold text-center text-xl">
              {`${
                settingsMap?.["sibling_discount"]
                  ? settingsMap["sibling_discount"]
                  : "0"
              }%`}
            </h2>
            <h3 className="text-center">per sibling</h3>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
