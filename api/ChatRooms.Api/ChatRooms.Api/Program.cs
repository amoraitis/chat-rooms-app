
using ChatRooms.Api.Models;
using ChatRooms.Api.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ChatRooms.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // Register MongoDB settings
            builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDB"));

            // Register MongoClient
            builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
            {
                var settings = serviceProvider.GetRequiredService<IOptions<MongoDBSettings>>().Value;
                return new MongoClient(settings.ConnectionURI);
            });

            // Add Database Service
            builder.Services.AddScoped(serviceProvider =>
            {
                var client = serviceProvider.GetRequiredService<IMongoClient>();
                var settings = serviceProvider.GetRequiredService<IOptions<MongoDBSettings>>().Value;
                return client.GetDatabase(settings.DatabaseName);
            });

            builder.Services.AddScoped<IChatService, ChatService>();
            builder.Services.AddScoped<IRoomService, RoomService>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();
            
            using (var scope = app.Services.CreateScope())
            {
                var database = scope.ServiceProvider.GetRequiredService<IMongoDatabase>();
                MongoDbInitializer.Initialize(database);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors(s => s.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
