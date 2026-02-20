import { Link } from 'react-router-dom';
import { useCollectionsStore } from '../store/collections';
import type { Collection } from '../types/ui';

const Saved = () => {
    const { collections } = useCollectionsStore();
    const watchlist = collections.find(c => c.isDefault);
    const customCollections = collections.filter(c => !c.isDefault);

    const renderCollectionPreview = (collection: Collection) => {
        const previewImages = collection.items.slice(0, 3).map(item =>
            item.imageSet?.verticalPoster?.w480 || 'https://via.placeholder.com/150'
        );

        return (
            <Link to={`/saved/collection/${collection.id}`} key={collection.id} className="block group">
                <div className="relative h-48 w-full bg-gray-800 rounded-xl overflow-hidden mb-3 border border-gray-700 hover:border-indigo-500 transition-colors">
                    {previewImages.length > 0 ? (
                        <div className="grid grid-cols-3 h-full gap-0.5">
                            {previewImages.map((img, i) => (
                                <img key={i} src={img} alt="" className="h-full w-full object-cover" />
                            ))}
                            {/* Fill empty slots if less than 3 */}
                            {Array.from({ length: 3 - previewImages.length }).map((_, i) => (
                                <div key={`empty-${i}`} className="bg-gray-700/50" />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Empty Collection
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <h3 className="font-semibold text-lg">{collection.title}</h3>
                <p className="text-sm text-gray-400">{collection.items.length} items</p>
            </Link>
        );
    };

    return (
        <div className="space-y-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Library</h1>

            <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Watchlist
                </h2>
                {watchlist && renderCollectionPreview(watchlist)}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Collections
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {customCollections.map(renderCollectionPreview)}
                    <button className="h-full w-full border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-colors min-h-[200px]">
                        + Create Collection
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Saved;
