// ==UserScript==
// @name     ESPN Fantasy League Score Bug
// @version  1
// @grant    none
// @match 	 https://fantasy.espn.com/football/league/scoreboard*
// ==/UserScript==


// CONSTANTS START
const PLAYER_RANK_IMAGE_SIZE = 70;

const FADE_TRANSITION_SPEED = 1;
const TICKER_INFO_CONTAINER_TRANSITION_SPEED = 1;
const LOGO_SPIN_TRANSITION_SPEED = 1;
const TIME_BETWEEN_DATA_CHANGE = 6;
const TWEAK_TIME = .125;

const TOTAL_LOOP_TIME_IN_MS = ((FADE_TRANSITION_SPEED * 2) + (TICKER_INFO_CONTAINER_TRANSITION_SPEED * 2) + (TIME_BETWEEN_DATA_CHANGE * 2) + LOGO_SPIN_TRANSITION_SPEED + TWEAK_TIME) * 1000;
// CONSTANTS END

// CSS START
const add_global_styles = (css_string) => {
    let head, style;
    head = document.getElementsByTagName('head')[0];
  
    if (head) {
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css_string;
      head.appendChild(style);
    }
}

custom_css = `
	* {
		border: unset;
		height: unset;
		width: unset;
		padding: unset;
		margin: unset;
	}

	footer, #games-footercol, .Scoreboard__Callouts, .adjust_scoring_link, 
	.ScoreCell__Team, .navigation__container, .headers, .header-redirect-links, 
	.scoreboard > div:first-child, .league-scoreboard-page:before, .Scoreboard__Column--2 {
		display: none; 
	}
	
	.ScoreboardScoreCell__Logo {
		height: 48px;
		width: 48px;
		padding-right: 10px;
	}

	.Scoreboard {
		min-height: unset;
	}

	.scoreboard {
		padding-top: 0;
	}
	
	.teamPlayerStatus {
		width: 250px;
	}

	.Scoreboard__Column--1 {
		border: 4px solid #fc05e7;
		padding-top: 6px;
		padding-bottom: 6px;
	}

	.AnchorLink {width: 50px;}

	ul {min-width: 56px;}

	li {padding-right: 3px;}

	.ScoreboardScoreCell__Competitors {flex-direction: unset;}

	.ScoreCell__Score {
		min-width: 60px;
		text-align: start;
	}

	#league_ticker {
		position: fixed;
		top: 500px;
		z-index: 1;
		width: 100%;
		height: 200px;
		background-color: #fc05e7;
	}

	#ticker_team_logo{
		width: 120px;
		height: 120px;
		border: 1px solid white;
		border-radius: 50%;
		left: 15px;
		position: fixed;
		top: 550px;
		z-index: 10;
		background-color: white;
		transition: all ${(LOGO_SPIN_TRANSITION_SPEED * 1000) / 2}ms;
	}
		
	#ticker_info_mask_container {
		position: absolute;
		height: 120px;
		width: 132px;
		z-index: 9;
		border-radius: 0 60px 60px 0;
		background-color: #fc05e7;
		top: 50px;
	}

	#ticker_info_container {
		position: fixed;
		width: 670px;
		height: 80px;
		background-color: white;
		left: 27px;
		top: 585px;
		border-radius: 50px 0 0 50px;
		transition: width ${TICKER_INFO_CONTAINER_TRANSITION_SPEED}s;
	}

	#ticker_info_container:after {
		content: ' ';
		width: 0;
		height: 0;
		border-right: 100px solid transparent;
		border-top: 80px solid white;
		position: absolute;
		right: -100px;
	}

	#ticker_team_name_container {
		position: fixed;
		font-size: 3rem;
		font-weight: bold;
		-webkit-text-stroke-width: 2px;
		-webkit-text-stroke-color: white;
		top: 580px;
		left: 150px;
		z-index: 6;
	}

	#ticker_status_container {
		position: fixed;
		top: 638px;
		left: 150px;
		transition: all ${TICKER_INFO_CONTAINER_TRANSITION_SPEED}s;
	}

	#ticker_currently_playing_container,  #ticker_yet_to_play_container, 
  #ticker_proj_total_container, #ticker_mins_left_container {
		display: inline-block;
		padding-right: 5px;
	}

	#ticker_status_container .ticker_status_value {
		padding-left: 5px;
		padding-right: 5px;
		border-right: 1px solid black;
	}

	#ticker_mins_left_container .ticker_status_value {
		border-right: 0px solid black;
	}

	#ticker_player_rank_container {
		position: fixed;
		z-index: 15;
		left: 150px;
		top: 590px;
		transition: opacity ${FADE_TRANSITION_SPEED}s, left ${TICKER_INFO_CONTAINER_TRANSITION_SPEED}s;
	}

	#ticker_player_rank_container .player_rank_container {
		height: ${PLAYER_RANK_IMAGE_SIZE}px;
		display: inline-block;
		position: relative;
		top: -20px;
		left: 6px;
	}

	#ticker_player_rank_container .player_rank_container .player_rank_name {
		color: grey;		
	}

	#ticker_player_rank_container .player_rank_container .player_rank_stat {
		color: #444;
	}


	#ticker_player_rank_container img {
		display: inline-block;
		position: relative;
		width: ${PLAYER_RANK_IMAGE_SIZE}px;
		height: auto;
		border-radius: 50%;
		border: 1px dashed grey;
	}

	#ticker_player_rank_container img:not(:first-child) {
    margin-left: 30px;
	}

	.fade_out {
		opacity: 0;
	}

	.spin_logo {
 		transform: rotateY(5760deg);
	}

	#ticker_info_container.width_to_0 {
		width: 0;
	}

	#ticker_team_name_container {
		transition: all 1s;
	}
	
	#ticker_team_name_container.go_left, #ticker_status_container.go_left, #ticker_player_rank_container.go_left {
		left: -520px;
	}

	#new_element {
    position: absolute;
    top: -26px;
    left: -20px;
    background-color: white;
    height 50px;
    width: 220px;
    padding-left: 30px;
		margin-left: -20px;
		font-weight: bold;
		color: grey;
		font-size: 1.2rem;
	}
	
	#new_element:after {
		content: ' ';
		width: 0;
		height: 0;
		border-right: 50px solid transparent;
		border-top: 20px solid white;
		position: absolute;
		right: -50px;
	}

`;

add_global_styles(custom_css.replaceAll("\;", " !important\;"));
// CSS END


// FUNCTIONS START

// Checks that an element has height or width to determine if it's visible
const is_element_visible = (element) => {
  return element.offsetWidth > 0 || element.offsetHeight > 0;
}

// Uses an interval to wait for the specified element to render then resolves
const wait_for_element_to_render = (element) => {
  return new Promise(resolve => {
      let interval = setInterval(() => {
        if (is_element_visible(element)) {
					resolve();
        }
      }, 25);
    });
}


// Waits for an images src to start with http then resolves
const wait_for_image_to_have_link = (element) => {
  return new Promise(resolve => {
    let interval = setInterval(() => {
      let is_standard_link = element.src.startsWith("http");


      if (is_standard_link) {
        clearInterval(interval);
        resolve();
      }
    }, 25);
  });
}


// Makes the player_ranks div and treturns it, or returns false if there are no player stats
const make_player_ranks_element = (original_player_ranks_div) => {
	// Create the ticker teams player ranking container and assign its id and clone the 
  // appropriate original player_rank div

	let original_player_ranks_div_clone = document.createElement("div");
	original_player_ranks_div_clone.innerHTML = original_player_ranks_div.outerHTML;


  let ticker_player_rank_container_div = document.createElement("div");
  ticker_player_rank_container_div.id = "ticker_player_rank_container";
  ticker_player_rank_container_div.classList.add("fade_out");
  
  
  let original_player_ranks_div_clone_images = original_player_ranks_div_clone.querySelectorAll("img");
  let original_player_ranks_div_clone_names = original_player_ranks_div_clone.querySelectorAll(".Athlete__PlayerWrapper > h3");
  let original_player_ranks_div_clone_stats = original_player_ranks_div_clone.querySelectorAll(".Athlete__Stats span");
  let ranking_type_text = document.querySelectorAll(".ranking-type-text");
    
  if (original_player_ranks_div_clone_images.length > 0) {
    let new_element = document.createElement("div");
    new_element.id = "new_element";
    new_element.innerText = ranking_type_text ? ranking_type_text[0].innerText : "";
    
    
    for (let i = 0; i < original_player_ranks_div_clone_images.length; i++) {
      let player_rank_container_div = document.createElement("div");
      player_rank_container_div.classList.add("player_rank_container");
      
      let player_name_container_div = document.createElement("h4");
      player_name_container_div.classList.add("player_rank_name");
      
      let player_stat_container_div = document.createElement("h3");
      player_stat_container_div.classList.add("player_rank_stat");
      
      player_name_container_div.innerText = original_player_ranks_div_clone_names[i].innerText;
      player_stat_container_div.innerText = original_player_ranks_div_clone_stats[i].innerText;
      
      player_rank_container_div.append(player_name_container_div);
      player_rank_container_div.append(player_stat_container_div);
      
      // find image in dom and wait for url and make new image
      let image_in_dom = document.querySelectorAll(`img[title='${original_player_ranks_div_clone_images[i].title}']`)[0]

      wait_for_image_to_have_link(image_in_dom).then(() => {
        let new_image_element = document.createElement("img");

        new_image_element.src = image_in_dom.src.replace("h=80&w=80", `h=${PLAYER_RANK_IMAGE_SIZE}&w=${PLAYER_RANK_IMAGE_SIZE}`);
        
        ticker_player_rank_container_div.append(new_element)
        ticker_player_rank_container_div.append(new_image_element);
        ticker_player_rank_container_div.append(player_rank_container_div);
      });
    }
  } 
  else {
    ticker_player_rank_container_div.innerHTML = "<h1 style='color: #444' >No Player Data</h1>";
  }
  
  return ticker_player_rank_container_div;
}


const make_ticker_status_element = (status_labels) => {
  let ticker_status_container_div = document.createElement("div");
  let ticker_currently_playing_container_div = document.createElement("div");
  let ticker_yet_to_play_container_div = document.createElement("div");
  let ticker_proj_total_container_div = document.createElement("div");
  let ticker_mins_left_container_div = document.createElement("div");
 
  ticker_status_container_div.id = "ticker_status_container";
  ticker_currently_playing_container_div.id = "ticker_currently_playing_container";
  ticker_yet_to_play_container_div.id = "ticker_yet_to_play_container";
  ticker_proj_total_container_div.id = "ticker_proj_total_container";
  ticker_mins_left_container_div.id = "ticker_mins_left_container";
  
  ticker_currently_playing_container_div.innerHTML = status_labels[0];
  ticker_yet_to_play_container_div.innerHTML = status_labels[1];
  ticker_proj_total_container_div.innerHTML = status_labels[2];
  ticker_mins_left_container_div.innerHTML = status_labels[3];
  
  ticker_status_container_div.append(ticker_currently_playing_container_div);
  ticker_status_container_div.append(ticker_yet_to_play_container_div);
  ticker_status_container_div.append(ticker_proj_total_container_div);
  ticker_status_container_div.append(ticker_mins_left_container_div);
  
  return ticker_status_container_div;
}



const make_element_with_id = (tag, id) => {
	let new_div = document.createElement(tag);
  new_div.id = id;
  
  return new_div;
}


const wait_n_seconds = (seconds) => {
	let wait_time_in_ms = seconds * 1000;
  
  return new Promise (resolve => {
  	setTimeout(() => {
    	resolve();
    }, wait_time_in_ms)
  });
}


const do_fading_transitions = () => {
	return new Promise(resolve => {
        
  	wait_n_seconds(TIME_BETWEEN_DATA_CHANGE).then(() => {
      document.getElementById("ticker_team_name_container").classList.add("fade_out");
      document.getElementById("ticker_status_container").classList.add("fade_out");


      wait_n_seconds(FADE_TRANSITION_SPEED).then(() => {
        document.getElementById("ticker_player_rank_container").classList.remove("fade_out");
        
        wait_n_seconds(FADE_TRANSITION_SPEED + TIME_BETWEEN_DATA_CHANGE).then(() => {
        	resolve();
        });
      });
    });
  });
}


const hide_ticker_info_container = () => {
	return new Promise(resolve => {
    document.getElementById("ticker_info_container").classList.add("width_to_0");
    document.getElementById("ticker_team_name_container").classList.add("go_left");
    document.getElementById("ticker_status_container").classList.add("go_left");
    document.getElementById("ticker_player_rank_container").classList.add("go_left");
  	
    wait_n_seconds(TICKER_INFO_CONTAINER_TRANSITION_SPEED).then(() => {
    	resolve();
    });
  });
}


const show_ticker_info_container = () => {
	return new Promise(resolve => {
    document.getElementById("ticker_info_container").classList.remove("width_to_0");
    document.getElementById("ticker_team_name_container").classList.remove("go_left");
    document.getElementById("ticker_status_container").classList.remove("go_left");
    document.getElementById("ticker_player_rank_container").classList.remove("go_left");
  	
    wait_n_seconds(TICKER_INFO_CONTAINER_TRANSITION_SPEED).then(() => {
    	resolve();
    });
  });
}


const handle_post_displayed_info = () => {
  show_ticker_info_container().then(() => {
    do_fading_transitions().then(() => {
      hide_ticker_info_container();
    });
  });
}


const create_logo_img = (original_logo_element) => {
	let team_logo_img = make_element_with_id("img", "ticker_team_logo");

  wait_for_image_to_have_link(original_logo_element).then(() => {
    team_logo_img.src = original_logo_element.src;
  });
  
  return team_logo_img;
}


const change_logo_img = (logo_element, original_logo_element) => {
  return new Promise(resolve => {
  	document.getElementById("ticker_team_logo").classList.add("spin_logo");
  
    setTimeout(() => {
      wait_for_image_to_have_link(original_logo_element).then(() => {
        logo_element.src = original_logo_element.src;
      });
      
      document.getElementById("ticker_team_logo").classList.remove("spin_logo");
      
      setTimeout(() => {
        resolve();
      }, LOGO_SPIN_TRANSITION_SPEED * 500);
      
    }, LOGO_SPIN_TRANSITION_SPEED * 500);
  });
}


window.addEventListener('load', () => {
  // Create the ticker container div and assign id
  let league_ticker_div = make_element_with_id("div", "league_ticker");
  let ticker_info_mask_container_div = make_element_with_id("div", "ticker_info_mask_container");
  let ticker_info_container_div = make_element_with_id("div", "ticker_info_container");
  ticker_info_container_div.classList.add("width_to_0");
  
  // Append the team logo, team name, and the ticker info container to the league ticker container
  league_ticker_div.append(ticker_info_mask_container_div);
  league_ticker_div.append(ticker_info_container_div);
  
  // Append the ticker to the body
  document.body.append(league_ticker_div);
  
  
  let team_i = 0;
  
  let loop_interval = setInterval(() => {
    let team_logos = document.querySelectorAll(".ScoreboardScoreCell__Logo");
    let team_names = document.querySelectorAll(".ScoreCell__TeamName");
    let status_labels = document.querySelectorAll(".statusLabel");
    let player_ranks = document.querySelectorAll(".player-ranks");
    let team_count = team_logos.length;
  	let team_logo_img = document.getElementById("ticker_team_logo");
  	let team_logo_ready = false;
    
    // Handle the team_logo_img container
  	if (team_logo_img) {
      document.getElementById("ticker_info_container").innerHTML = "";
      
      change_logo_img(team_logo_img, team_logos[team_i]).then(() => {
      	team_logo_ready = true;
      });
    }
  	else {
      team_logo_img = create_logo_img(team_logos[team_i]);
      
      league_ticker_div.append(team_logo_img);
      
      team_logo_ready = true;
    }
  	

    // Build the status label array for make_ticker_status_element
    let team_offset = team_i === 0 ? 0 : (team_i * 4); // Adjusts for the status count and the current team in the loop
    let ticker_status_labels_array = [
      status_labels[0 + team_offset].outerHTML.replace("statusLabel", "ticker_status_label").replace("statusValue", "ticker_status_value"),
      status_labels[1 + team_offset].outerHTML.replace("statusLabel", "ticker_status_label").replace("statusValue", "ticker_status_value"),
      status_labels[2 + team_offset].outerHTML.replace("statusLabel", "ticker_status_label").replace("statusValue", "ticker_status_value"),
      status_labels[3 + team_offset].outerHTML.replace("statusLabel", "ticker_status_label").replace("statusValue", "ticker_status_value"),
    ]


    // Create the ticker status' container and its children and the ids
    let ticker_status_container_div = make_ticker_status_element(ticker_status_labels_array);

    // Create the ticker team name container and assign id and set the team name as innerText
    let ticker_team_name_container_div = make_element_with_id("div", "ticker_team_name_container");
    ticker_team_name_container_div.innerText = team_names[team_i].innerText;

    let ticker_player_rank_container_div = make_player_ranks_element(player_ranks[team_i]);
		
    
    ticker_status_container_div.classList.add("go_left");
    ticker_team_name_container_div.classList.add("go_left");
    ticker_player_rank_container_div.classList.add("go_left");

    // Append the status' and player ranks to the ticker info container
    ticker_info_container_div.append(ticker_team_name_container_div);
    ticker_info_container_div.append(ticker_status_container_div);
    ticker_info_container_div.append(ticker_player_rank_container_div);

    // Makes sure the logo has finished loading and spinning
    // Then handles the rest of the transitions
		let show_info_interval = setInterval(() => {
      if (team_logo_ready) {
				handle_post_displayed_info();
        clearInterval(show_info_interval);
      }
    }, 25);
  
    
    // Loop Control
    if (team_i < (team_count -1)) { 
    	team_i += 1;
    }
    else {
      team_i = 0;
    }
    
  }, TOTAL_LOOP_TIME_IN_MS);
});
