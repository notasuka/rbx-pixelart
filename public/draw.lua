print'started'

local Settings = (...)

local response = syn.request(
    {
        Url = "http://localhost:9001/output?size="..Settings.Size.."&image="..Settings.Image,  -- This website helps debug HTTP requests
        Method = "GET",
    }
)
print(response.StatusCode)
local Data = response.Body
local Player = game:GetService("Players").LocalPlayer

function GetBoard(plr, public)
    local Boards = workspace.DrawBoards.DrawBoards:GetChildren()
    local Found

    for i,v in pairs(Boards) do
        local name = v.name
        if v.name.Value == Player.Name then
            Found = v.Pixels
        end
    end

    if public then
        Found = workspace.PublicBoard.Pixels
    end

    return Found
end

local Base = GetBoard(Player, Settings.Public)
if not Base then
    return
end

local jsonData = game:GetService("HttpService"):JSONDecode(Data)
local i = 1
local n = 0
local x = 0

local s = Settings.Size
local Size = s*s

for v=0,Size-1 do
    x += 1
	n = v * 4
    
    local response = syn.request(
    {
        Url = "http://localhost:9001/hex",  -- This website helps debug HTTP requests
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"  -- When sending JSON, set this!
        },
        Body = game:GetService("HttpService"):JSONEncode({
            r = jsonData['data'][tostring(n)],
    		g = jsonData['data'][tostring(n+1)],
    		b = jsonData['data'][tostring(n+2)]
        })
    }
    )
    local newHex = game:GetService("HttpService"):JSONDecode(response.Body).hex
    game.ReplicatedStorage.Port:FireServer("ApplyColor",Base,newHex,i)

    i=i+1
end
