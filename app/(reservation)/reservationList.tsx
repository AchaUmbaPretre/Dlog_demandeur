import { getDemandeVehiculeUserOne } from '@/services/charroiService';
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Card } from 'react-native-paper';
import { useSelector } from 'react-redux';

const ReservationList = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const userId = useSelector((state: any) => state.auth?.currentUser?.id_utilisateur);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);


  const fetchDatas = async () => {
    try {
      setLoadingData(true);
      const [demandeData] = await Promise.all([
        getDemandeVehiculeUserOne(userId),
      ]);
      setData(demandeData.data);
    } catch (err) {
      Alert.alert('Erreur', "Échec de chargement des données.");
    } finally {
      setLoadingData(false);
    }
  };

useEffect(() => {
  if (userId) {
    fetchDatas(); // Chargement initial

    const interval = setInterval(() => {
      fetchDatas();
    }, 10000); 

    return () => clearInterval(interval);
  }
}, [userId]);


  const onRefresh = async () => {
  setRefreshing(true);
  await fetchDatas();
  setRefreshing(false);
};

  const getStatusStyle = (statut: string) => {
    switch (statut) {
      case "En attente d'affectation":
        return { color: '#FFA500' };
      case 'Véhicule affecté':
        return { color: '#4CAF50' };
      default:
        return { color: '#999' };
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card} elevation={3}>
      <Card.Content>
        <Text style={styles.title}>{item.nom_motif_demande}</Text>
        <Text style={styles.label}>
          Chargement prévu : {moment(item.date_prevue).format('DD/MM/YYYY HH:mm')}
        </Text>
        <Text style={styles.label}>
          Retour prévu : {moment(item.date_retour).format('DD/MM/YYYY HH:mm')}
        </Text>
        <Text style={styles.label}>Personnes à bord : {item.personne_bord}</Text>
        <Text style={styles.label}>Type véhicule : {item.nom_type_vehicule}</Text>
        <Text style={styles.label}>Destination : {item.nom_destination}</Text>
        <Text style={styles.label}>Service demandeur : {item.nom_service}</Text>
        <Text style={[styles.status, getStatusStyle(item.nom_statut_bs)]}>
          Statut : {item.nom_statut_bs}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="#007AFF" />
      </Pressable>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Liste des réservations</Text>
      </View>

        <FlatList
        data={data}
        keyExtractor={(item) => item.id_demande_vehicule.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune réservation trouvée.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default ReservationList;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
    backButton: {
    marginBottom: 16,
    marginTop: 10,
    paddingLeft: 4,
    alignSelf: "flex-start",
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  status: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
    color: '#888',
  },
});
