import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import {Box, Button, TextField} from "@material-ui/core";
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

    const sendRequest = (username: string) => {

        if (!requestIsAvailable){
            return;
        }

        const url = `https://winrateapi.lucaswinther.info/api/WinRate/GetWinrateTogether/1`

        const parameters = {
            user1: username,
            NoMatches: noOfGames
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

            <Button variant="contained" color="primary" onClick={() => sendRequest(username)}>
                Send
            </Button>

            <Typography>
                {winrateOfUser}'s winrate is {(gamesWon/(gamesLost + gamesWon) * 100).toFixed(2)}% based upon their last {gamesLost + gamesWon} games.
            </Typography>

        </div>

    );
}