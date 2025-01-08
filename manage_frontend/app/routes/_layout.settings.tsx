import { useRef } from "react";

const Settings = () => {
  const termDateRef = useRef<HTMLDialogElement>(null);
  const halfTermRef = useRef<HTMLDialogElement>(null);
  const handleModalOpen = (ref: React.RefObject<HTMLDialogElement>) => {
    ref.current?.showModal();
  };

  const handleModalClose = (ref: React.RefObject<HTMLDialogElement>) => {
    ref.current?.close();
  };
  return (
    <div>
      <h1 className="text-xl">Settings</h1>
      <div className="flex  w-4/6 gap-6 ">
        <button
          className="btn btn-accent m-6 min-w-14"
          onClick={() => handleModalOpen(termDateRef)}
        >
          Set term dates
        </button>
        <button
          className="btn btn-accent m-6 min-w-14"
          onClick={() => handleModalOpen(halfTermRef)}
        >
          Set Half-Term Dates
        </button>
      </div>

      <dialog ref={termDateRef} className="modal">
        <div className="modal-box size-11/12 max-w-8xl">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => handleModalClose(termDateRef)}
          >
            ✕
          </button>
          <h2 className="text-lg font-bold">Set Term Dates</h2>
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex gap-4">
              <label htmlFor="term1_start" className="w-full">
                Term 1 Start Date
              </label>
              <input id="term1_start" type="date" />
              <label htmlFor="term1_end" className="w-full">
                Term 1 End Date
              </label>
              <input id="term1_end" type="date" />
            </div>
            <div className="flex gap-4">
              <label htmlFor="term2_start" className="w-full">
                Term 2 Start Date
              </label>
              <input id="term2_start" type="date" />
              <label htmlFor="term2_end" className="w-full">
                Term 2 End Date
              </label>
              <input id="term2_end" type="date" />
            </div>
            <div className="flex gap-4">
              <label htmlFor="term3_start" className="w-full">
                Term 3 Start Date
              </label>
              <input id="term3_start" type="date" />
              <label htmlFor="term3_end" className="w-full">
                Term 3 End Date
              </label>
              <input id="term3_end" type="date" />
            </div>
          </div>
        </div>
      </dialog>
      <dialog ref={halfTermRef} className="modal">
        <div className="modal-box size-11/12 max-w-8xl">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => handleModalClose(halfTermRef)}
          >
            ✕
          </button>
          <h2 className="text-lg font-bold">Set Term Dates</h2>
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex gap-4">
              <label htmlFor="term1_halfterm_start" className="w-full">
                Term 1 Half-Term Start
              </label>
              <input id="term1_halfterm_start" type="date" />
              <label htmlFor="term1_halfterm_end" className="w-full">
                Term 1 Half-Term End
              </label>
              <input id="term1_halfterm_end" type="date" />
            </div>
            <div className="flex gap-4">
              <label htmlFor="term2_halfterm_start" className="w-full">
                Term 2 Half-Term Start
              </label>
              <input id="term2_halfterm_start" type="date" />
              <label htmlFor="term2_halfterm_end" className="w-full">
                Term 2 Half-Term End
              </label>
              <input id="term2_halfterm_end" type="date" />
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Settings;
