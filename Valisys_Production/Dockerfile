FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["Valisys_Production.csproj", "./"]
RUN dotnet restore "Valisys_Production.csproj"

COPY . .
RUN dotnet publish "Valisys_Production.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Valisys_Production.dll"]