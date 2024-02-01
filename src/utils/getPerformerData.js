import _ from "lodash";

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
	return { performer, event, year };
};

export default getPerformerData;
