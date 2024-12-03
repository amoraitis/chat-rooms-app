using MongoDB.Driver;

namespace ChatRooms.Api
{
    public static class MongoDbInitializer
    {
        public static void Initialize(IMongoDatabase database)
        {
            // Define the collection names
            var collectionsToEnsure = new[] { "Messages", "Rooms" };

            // Check existing collections
            var existingCollections = database.ListCollectionNames().ToList();

            foreach (var collectionName in collectionsToEnsure)
            {
                if (existingCollections.Contains(collectionName) == false)
                {
                    database.CreateCollection(collectionName);
                    Console.WriteLine($"Created collection: {collectionName}");
                }
            }
        }
    }
}
