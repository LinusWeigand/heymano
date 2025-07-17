import { SearchBarForm } from "./SearchBar";

export default function HeaderSearch({ isMapView }: { isMapView: boolean }) {
  return (
    <section className="pt-5 pb-8">
      <div className="container mx-auto px-4 lg:px-6 lg:px-8">
        <div className="flex flex-col lg:max-w-xl mx-auto items-center">
          {!isMapView && (
            <h1 className="text-4xl font-bold text-center mb-8 w-[300px] sm:w-full">
              Finde erfahrene Handwerker
            </h1>
          )}
          <div className={`flex mt-2 justify-center ${isMapView ? 'lg:block hidden' : ''}`}>
            <SearchBarForm isMapView={isMapView} />
          </div>
        </div>
      </div>
    </section>
  );
}
