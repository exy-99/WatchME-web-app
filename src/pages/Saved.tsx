import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useCollectionsStore } from '../store/collections';
import { useReducedMotion } from '../hooks/useReducedMotion';
import GlassCard from '../components/ui/GlassCard';
import type { Collection } from '../types/ui';

const Saved = () => {
    const prefersReducedMotion = useReducedMotion();
    const { collections, createCollection } = useCollectionsStore();
    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleCreateCollection = () => {
        if (inputValue.trim()) {
            createCollection(inputValue.trim());
            setInputValue('');
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        setInputValue('');
        setShowModal(false);
    };

    const renderCollectionCard = (collection: Collection) => {
        const posterImages = collection.items.slice(0, 4).map(item =>
            (item as any).imageSet?.verticalPoster?.w720 || (item as any).poster || 'https://via.placeholder.com/150'
        );

        const hasMosaicImages = collection.items.length >= 4;

        return (
            <Link
                to={`/saved/collection/${collection.id}`}
                key={collection.id}
                className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED] rounded-2xl"
                aria-label={`View ${collection.title} collection with ${collection.items.length} items`}
            >
                <motion.div
                    className="relative rounded-2xl overflow-hidden cursor-pointer group"
                    style={{
                        position: 'relative',
                        height: '200px',
                        boxShadow: 'none',
                    }}
                    whileHover={prefersReducedMotion ? {} : {
                        scale: 1.03,
                        boxShadow: '0 0 30px rgba(124, 58, 237, 0.3)',
                    }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                >
                    {/* Background - Mosaic or Gradient */}
                    {hasMosaicImages ? (
                        <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                            {collection.items.slice(0, 4).map((item, i) => (
                                <img
                                    key={i}
                                    src={posterImages[i]}
                                    alt={`${(item as any).title} poster from ${collection.title}`}
                                    className="w-full h-full object-cover"
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{
                                background: 'linear-gradient(135deg, #1E1A3A 0%, #141420 100%)',
                            }}
                        />
                    )}

                    {/* Overlay Gradient */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.3) 100%)',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Content - Bottom Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end h-full">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h3
                                    className="font-display text-white leading-tight"
                                    style={{
                                        fontSize: '24px',
                                        letterSpacing: '1px',
                                    }}
                                >
                                    {collection.title}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '13px',
                                        color: '#9CA3AF',
                                        marginTop: '4px',
                                    }}
                                >
                                    {collection.items.length} {collection.items.length === 1 ? 'movie' : 'movies'}
                                </p>
                            </div>

                            {/* Default Badge */}
                            {collection.isDefault && (
                                <motion.div
                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                        background: 'rgba(124, 58, 237, 0.3)',
                                        border: '1px solid rgba(124, 58, 237, 0.5)',
                                        color: '#C4B5FD',
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    Default
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </Link>
        );
    };

    return (
        <div className="space-y-12">
            {/* Page Title */}
            <motion.h1
                className="font-display leading-tight"
                style={{
                    fontSize: '56px',
                    letterSpacing: '2px',
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                My Collections
            </motion.h1>

            {/* Collections Grid */}
            <motion.div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '24px',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, staggerChildren: 0.05 }}
            >
                {collections.map((collection) => (
                    <motion.div
                        key={collection.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderCollectionCard(collection)}
                    </motion.div>
                ))}
            </motion.div>

            {/* Floating Action Button */}
            <motion.button
                onClick={() => setShowModal(true)}
                className="fixed flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                style={{
                    bottom: '100px',
                    right: '24px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(124, 58, 237, 0.5)',
                    zIndex: 40,
                }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: prefersReducedMotion ? 10 : 17, duration: prefersReducedMotion ? 0.01 : 0.3 }}
                aria-label="Create a new collection"
            >
                <Plus size={24} color="white" />
            </motion.button>

            {/* Modal Backdrop and Content */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        style={{
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                        onClick={handleCancel}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: prefersReducedMotion ? 1 : 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: prefersReducedMotion ? 1 : 0.9, opacity: 0 }}
                            transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, type: 'spring', stiffness: 300, damping: prefersReducedMotion ? 10 : 25 }}
                        >
                            <GlassCard padding="lg" className="w-96">
                                <div className="space-y-6">
                                    {/* Modal Title */}
                                    <h2
                                        className="font-display text-white"
                                        style={{
                                            fontSize: '28px',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        Create Collection
                                    </h2>

                                    {/* Input Field */}
                                    <motion.div
                                        animate={{
                                            borderColor: 'rgba(124, 58, 237, 0.3)',
                                            boxShadow: '0 0 0 0px rgba(124, 58, 237, 0)',
                                        }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            background: 'rgba(30, 26, 58, 0.8)',
                                            border: '1px solid',
                                            borderRadius: '16px',
                                            backdropFilter: 'blur(8px)',
                                            WebkitBackdropFilter: 'blur(8px)',
                                            padding: '0 16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleCreateCollection();
                                                if (e.key === 'Escape') handleCancel();
                                            }}
                                            placeholder="Enter collection name..."
                                            autoFocus
                                            className="w-full bg-transparent border-none outline-none text-white text-base py-4"
                                            style={{
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                        />
                                    </motion.div>

                                    {/* Buttons */}
                                    <div className="flex gap-3 justify-end">
                                        {/* Cancel Button */}
                                        <motion.button
                                            onClick={handleCancel}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                borderRadius: '999px',
                                                padding: '12px 24px',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                            whileHover={prefersReducedMotion ? {} : { backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                                            whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                                            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                                            aria-label="Cancel collection creation"
                                        >
                                            Cancel
                                        </motion.button>

                                        {/* Create Button */}
                                        <motion.button
                                            onClick={handleCreateCollection}
                                            disabled={!inputValue.trim()}
                                            style={{
                                                background: inputValue.trim()
                                                    ? 'linear-gradient(135deg, #7C3AED, #EC4899)'
                                                    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(236, 72, 153, 0.5))',
                                                border: 'none',
                                                borderRadius: '999px',
                                                padding: '12px 24px',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                            className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                            whileHover={inputValue.trim() && !prefersReducedMotion ? { scale: 1.05 } : {}}
                                            whileTap={inputValue.trim() && !prefersReducedMotion ? { scale: 0.95 } : {}}
                                            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                                            aria-label="Create collection"
                                        >
                                            Create
                                        </motion.button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Saved;
