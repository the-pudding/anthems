import _ from "lodash";
import ids from "$data/ids.csv";

const getPerformerData = (id) => {
	const performer = _.startCase(id.split("_")[0].replace(/-/g, " "));
	const event = _.startCase(id.split("_")[1].replace(/-/g, " "))
		.replace("Nba", "NBA")
		.replace("Wnba", "WNBA")
		.replace("Allstar", "All-Star")
		.replace("Mlb", "MLB")
		.replace("Ncaa", "NCAA")
		.replace("Dnc", "DNC")
		.replace("Rnc", "RNC")
		.replace("Nfl", "NFL");
	const year = id.split("_")[2];
	const genre = _.startCase(ids.find((d) => d.id === id).artistGenre);
	return { performer, event, year, genre };
};

export default getPerformerData;
