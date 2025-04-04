import { useRoute } from "@react-navigation/native";
import { FlatList } from "react-native";
import { useState } from "react";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Filter } from "@components/Filter";
import { Highlight } from "@components/Highlight";
import { ListEmpty } from "@components/ListEmpty";
import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";

type RouteParams = {
    group:string;
}

export function Players(){
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    return(
        <Container>
            <Header showBackButton/>

            <Highlight
                title={group}
                subtitle="Adicione a galera e separe os times"
            />
            <Form>

                <Input 
                    placeholder="Nome do jogador"
                    autoCorrect={false}
                />

                <ButtonIcon 
                    icon="add"
                    type="PRIMARY"    
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
                keyExtractor={item => item}
                renderItem={({item}) => 
                    <PlayerCard
                        name={item}
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