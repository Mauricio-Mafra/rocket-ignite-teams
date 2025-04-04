import { useRoute } from "@react-navigation/native";
import { Alert, FlatList, TextInput } from "react-native";
import { useState, useEffect, useRef } from "react";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Filter } from "@components/Filter";
import { Highlight } from "@components/Highlight";
import { ListEmpty } from "@components/ListEmpty";
import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";

type RouteParams = {
    group:string;
}

export function Players(){
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    async function handleAddPlayer(){
        if(newPlayerName.trim().length === 0){
            return Alert.alert('Novo jogador', 'Informe o nome do jogador para adicionar.')
        }

        const newPlayer = { 
            name: newPlayerName,
            team,
        }

        try{
            await playerAddByGroup(newPlayer, group);
        
            newPlayerNameInputRef.current?.blur();
            setNewPlayerName('');
            fetchPlayersByTeam();
        

        }catch(error){
            if(error instanceof AppError){
                Alert.alert('Novo jogador', error.message);
            }else{
                console.log(error);
                Alert.alert('Novo jogador', 'Não foi possível adicionar')
            }
        }
    }

    async function fetchPlayersByTeam() {
        try{
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        }catch(error){
            console.log(error);
            Alert.alert('Jogadores', 'Não foi possível carregar os jogadores do time selecionado')
        }
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);

    return(
        <Container>
            <Header showBackButton/>

            <Highlight
                title={group}
                subtitle="Adicione a galera e separe os times"
            />
            <Form>

                <Input 
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome do jogador"
                    autoCorrect={false}
                    value={newPlayerName}
                    onChangeText={setNewPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />

                <ButtonIcon 
                    icon="add"
                    type="PRIMARY"    
                    onPress={handleAddPlayer}
                />
            </Form>
            <HeaderList>

                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({item}) => (
                        <Filter 
                        title={item}
                        isActive={item === team}
                        onPress={() => setTeam(item)}
                        />
                        
                    )}
                    horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>

            </HeaderList>

            <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({item}) => 
                    <PlayerCard
                        name={item.name}
                        onRemove={()=>{}}
                    />
                }
                ListEmptyComponent={() =>
                          <ListEmpty message='Que tal cadastrar alguns jogadores?'/>
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[{paddingBottom: 100},players.length === 0 && { flex: 1 }]}
            />

            <Button 
                type="SECONDARY"
                title="Remover turma"
            />
        
            
        </Container>
    )
}