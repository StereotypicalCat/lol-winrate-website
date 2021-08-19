import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import {Button, Checkbox, FormControlLabel, FormGroup, FormLabel, TextField} from "@material-ui/core";
import axios from "axios";
import './App.css';

export default function App() {

    const [requestIsAvailable, setRequestIsAvailable] = React.useState<boolean>(true);

    const [gamesWon, setGamesWon] = React.useState<number>(0);
    const [gamesLost, setGamesLost] = React.useState<number>(0);
    const [winrateOfUser, setwinrateOfUser] = React.useState<string>("");

    const [noOfGames, setNoOfGames] = React.useState<number>(30);
    const handleNoOfGames = (event: any, newValue: number | number[]) => {
        setNoOfGames(newValue as number);
    };

    const [username, setUsername] = React.useState<string>("");
    const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    /*
    * Game type buttons Buttons:
    * */
    const [gameTypes, setGameTypes] = React.useState({
        aram: true,
        flex: true,
        soloduo: true,
        draft: true,
        blind: true,
        other: true
    });
    const handleChangeGameTypes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGameTypes({ ...gameTypes, [event.target.name]: event.target.checked });
    };



    const sendRequest = (username: string) => {

        if (!requestIsAvailable){
            return;
        }

        const url = `https://winrateapi.lucaswinther.info/api/WinRate/GetWinrateTogether/1`

        const convertMatchTypesToBackend = (gameTypes: {aram: boolean, flex: boolean, soloduo: boolean, draft: boolean, blind: boolean, other: boolean}) => {

            let returnString = "";

            if (gameTypes.aram){
                returnString = returnString + "a";
            }
            if (gameTypes.soloduo){
                returnString = returnString + "s";
            }
            if (gameTypes.flex){
                returnString = returnString + "f";
            }
            if (gameTypes.draft){
                returnString = returnString + "d";
            }
            if (gameTypes.blind){
                returnString = returnString + "b";
            }
            if (gameTypes.other){
                returnString = returnString + "o";
            }

            return returnString;
        }

        const parameters = {
            user1: username,
            NoMatches: noOfGames,
            MatchSelector: `${convertMatchTypesToBackend(gameTypes)}`
        }

        setRequestIsAvailable(false);
        axios.get(url, {
            params: parameters
        }).then(function (result) {
            console.log(result.data);
            setGamesWon(result.data.wins);
            setGamesLost(result.data.losses);
        }).catch(function (error) {
            console.log("There was an error getting the winrate");
            console.log(error);
        }).then(function () {
            setRequestIsAvailable(true);
            setwinrateOfUser(username);
        });
    }


    return (
        <div id={"appContainer"}>

            <TextField id="standard-basic" label="username" value={username} onChange={handleUsername} />

            <Typography gutterBottom>
                Number of games: {noOfGames}
            </Typography>
            <Grid container spacing={2} id={"sliderContainer"}>
                <Grid item xs>
                    <Slider value={noOfGames} onChange={handleNoOfGames} aria-labelledby="continuous-slider" />
                </Grid>
            </Grid>

            <FormLabel component="legend">Assign Game Types</FormLabel>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.aram} onChange={handleChangeGameTypes} name="aram" />}
                    label="Aram"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.flex} onChange={handleChangeGameTypes} name="flex" />}
                    label="Ranked Flex"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.soloduo} onChange={handleChangeGameTypes} name="soloduo" />}
                    label="Ranked Solo/Duo"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.draft} onChange={handleChangeGameTypes} name="draft" />}
                    label="Normal Draft"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.blind} onChange={handleChangeGameTypes} name="blind" />}
                    label="Normal Blind"
                />
                <FormControlLabel
                    control={<Checkbox checked={gameTypes.other} onChange={handleChangeGameTypes} name="other" />}
                    label="Other Gamemodes (Poro King, One For All, Etc)"
                />
            </FormGroup>

            <Button variant="contained" color="primary" onClick={() => sendRequest(username)}>
                Send
            </Button>

            <Typography>
                {winrateOfUser}'s winrate is {(gamesWon/(gamesLost + gamesWon) * 100).toFixed(2)}% based upon their last {gamesLost + gamesWon} games.
            </Typography>

        </div>

    );
}