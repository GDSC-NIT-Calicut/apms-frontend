import { useState } from 'react';

export default function SubmitEventRequest() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files?.[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // TODO: API call
  };

  return (
    <div className="flex">

      <main className="flex-1 flex flex-col">
        <section className="flex justify-center items-center flex-col mt-12 px-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E2453D] to-[#557FDF] text-transparent bg-clip-text mb-8">
            Submit Requests
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 w-full max-w-md text-white"
          >
            <div>
              <label htmlFor="title">Title</label>
              <input
                name="title"
                type="text"
                className="w-full p-2 mt-1 bg-neutral-900 border border-neutral-700 rounded"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="date">Date</label>
              <input
                name="date"
                type="date"
                className="w-full p-2 mt-1 bg-neutral-900 border border-neutral-700 rounded"
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="category">Category</label>
              <input
                name="category"
                type="text"
                className="w-full p-2 mt-1 bg-neutral-900 border border-neutral-700 rounded"
                onChange={handleChange}
              />
            </div>

           <div className="mt-4">
            <label htmlFor="file" className="block text-white mb-2">
                PDF File
            </label>

            <input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleChange}
            />

            <label
                htmlFor="file"
                className="ml-42 mt-4 mb-2 px-3 py-1 bg-neutral-800 text-sm text-white rounded-3xl cursor-pointer hover:opacity-90 border border-neutral-500"
            >
                Upload PDF
            </label>

            {formData.file && (
                <p className="mt-4 text-sm text-white">{formData.file.name}</p>
            )}
            </div>


            <div className='w-50 ml-30 mt-10 px-[1px] py-[1px] justify-center items-center bg-gradient-to-r from-[#E2453D] to-[#B0DE50] rounded-xl hover:opacity-90'>
                <button
                type="submit"
                className="w-full bg-neutral-600 px-4 py-2 hover:opacity-90 font-semibold rounded-xl cursor-pointer"
                >
                Submit
                </button>
            </div>    
          </form>
        </section>
      </main>
    </div>
  );
}
