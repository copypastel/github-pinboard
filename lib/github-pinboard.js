var GithubPinboard = function(user, repo, containerId) {                                             
  this.user = user;
  this.repo = repo;
  this.containerId = containerId || "github-pinboard";                                      

  var id = "pinboard" + GithubPinboard.iterator++;
  var script = document.createElement("script");                                                     
  script.setAttribute("src", "https://api.github.com/repos/" + user + "/" + repo + "/contributors?callback=GithubPinboard." + id + ".parse");

  var spinner = document.createElement("img");
  spinner.setAttribute("class", "github-pinboard-spinner");
  document.getElementById(this.containerId).appendChild(spinner);

  var head = document.querySelector("head");
  head.appendChild(script);

  var cssHref = "http://copypastel.github.com/github-pinboard/lib/github-pinboard.css";
  if (document.querySelector("link[href='" + cssHref + "']") == undefined) {
    var stylesheet = document.createElement("link");                                                   
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("href", cssHref);                                             
    stylesheet.setAttribute("type", "text/css");
    stylesheet.setAttribute("media", "screen");

    head.insertBefore(stylesheet, head.firstChild);
  }

  GithubPinboard[id] = this;
} 

GithubPinboard.iterator = 0;

GithubPinboard.prototype.parse = function(response) {                                                          
  var container = document.getElementById(this.containerId);
  container.innerHTML = "";

  var meta = response["meta"];
  if (meta["status"] != 200) {                                                                       
    var error = meta["status"] + " " + response["data"]["message"];                                  
    throw "<GithubPinboard> Error fetching repository " + this.user + "/" + this.repo + ": " + error;
  } 
  
  var contributors = response["data"];                                                               
  var pinboard = document.createElement("div");                                                      
  contributors.forEach( function(contributor) {                                                      
    var login = contributor["login"];
    var avatar = contributor["avatar_url"];                                                          
    var imagemapName = "github-pinboard-imagemap-" + login;                                          
    
    var imagemap = document.createElement("map");                                                    
    imagemap.setAttribute("name", imagemapName);
    pinboard.appendChild(imagemap);
    
    var area = document.createElement("area");                                                       
    area.setAttribute("shape", "circle");
    area.setAttribute("coords", "25 25 25");                                                         
    area.setAttribute("href", "http://github.com/" + login);                                         
    area.setAttribute("alt", login);
    area.setAttribute("title", login);
    imagemap.appendChild(area);
    
    var img = document.createElement("img");                                                         
    img.setAttribute("usemap", "#" + imagemapName);                                                        
    img.setAttribute("class", "github-pinboard-pin");                                              
    img.setAttribute("alt", login);
    img.setAttribute("src", avatar);                                                                 
    pinboard.appendChild(img);
  }); 
  
  container.appendChild(pinboard);                         
} 
