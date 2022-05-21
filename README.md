# rbx-pixelart
 pixel art generation for a roblox game

 use with a script injector
 
 local Settings = {
    Image = "source.png",
    Size = 100,
    Public = true
}
loadstring(game:HttpGet(("http://localhost:9001/draw.lua"), true))(Settings)
