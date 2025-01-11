export function Header() {
  return (
    <header className='border-b border-gray-200 dark:border-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <span className='text-xl font-bold'>GeoStats</span>
          </div>
          <div>
            <button className='px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
              About
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
