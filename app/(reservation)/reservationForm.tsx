import {
  getCatVehicule,
  getChauffeur,
  getDestination,
  getMotif,
  getServiceDemandeur,
  getVehiculeDispo,
} from "@/services/charroiService";
import { getClient } from "@/services/clientService";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, Card, TextInput, Title } from "react-native-paper";
import { useSelector } from "react-redux";

interface Vehicule {
  id_vehicule: number;
  immatriculation: string;
  nom_marque: string;
  modele: string;
}

interface Motif {
  id_motif_demande: number;
  nom_motif_demande: string;
}
interface Service {
  id_service_demandeur: number;
  nom_service: string;
}
interface Destination {
  id_destination: number;
  nom_destination: string;
}
interface Client {
  id_client: number;
  nom: string;
}

interface TypeVehicule {
  id_cat_vehicule : number,
  nom_cat: string;
}

interface FormState {
  id_vehicule: number | null;
  id_motif: number | null;
  id_demandeur: number | null;
  id_client: number | null;
  id_destination: number | null;
  personne_bord: string;
  id_type_vehicule: number | null;
}

const ReservationForm: React.FC = () => {
  const [loadingData, setLoadingData] = useState(false);
  const userId = useSelector((state: any) => state.auth?.currentUser?.id_utilisateur);
  const [vehiculeList, setVehiculeList] = useState<Vehicule[]>([]);
  const [catList, setCatList] = useState<TypeVehicule[]>([]);
  const [motifList, setMotifList] = useState<Motif[]>([]);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [destinationList, setDestinationList] = useState<Destination[]>([]);
  const [clientList, setClientList] = useState<Client[]>([]);
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    id_vehicule: null,
    id_motif: null,
    id_demandeur: null,
    id_client: null,
    id_destination: null,
    personne_bord: "",
    id_type_vehicule : null
  });

  const fetchDatas = async () => {
    try {
      setLoadingData(true);
      const [
        vehiculeData,
        catData,
        serviceData,
        motifData,
        destinationData,
        clientData,
      ] = await Promise.all([
        getVehiculeDispo(),
        getCatVehicule(),
        getChauffeur(),
        getServiceDemandeur(),
        getMotif(),
        getDestination(),
        getClient(),
      ]);
      setVehiculeList(vehiculeData.data);
      setServiceList(serviceData.data);
      setMotifList(motifData.data);
      setDestinationList(destinationData.data);
      setClientList(clientData.data);
      setCatList(catData.data)
    } catch (err) {
      Alert.alert("Erreur", "Échec de chargement des données.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, []);


  const handleChange = (name: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.id_vehicule || !form.id_motif || !form.id_demandeur ) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    try {
      setLoadingData(true);
/*       await postSortieVehiculeExceptionnel({
        ...form,
        id_agent: userId
      }); */
      Alert.alert("Succès", "Sortie enregistré avec succès !");
      setForm({
        id_vehicule: null,
        id_motif: null,
        id_demandeur: null,
        id_client: null,
        id_destination: null,
        personne_bord: "",
        id_type_vehicule: null
      });
      fetchDatas();
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'enregistrer le retour.");
    } finally {
      setLoadingData(false);
    }
  };

  const renderPicker = (label: string, key: keyof FormState, data: any[], labelProp: string, valueProp: string) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form[key]}
          onValueChange={(val) => handleChange(key, val)}
        >
          <Picker.Item label={`-- Sélectionner ${label.toLowerCase()} --`} value={null} />
          {data.map((item, index) => (
            <Picker.Item
              key={`${key}-${item[valueProp] ?? index}`} // clé unique même si valeur manquante
              label={item[labelProp]}
              value={item[valueProp]}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#007AFF" />
        </Pressable>

        <View style={styles.inner}>
          <Title style={styles.title}>Formulaire de reservations</Title>

          {loadingData ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <Card style={styles.card}>
              <Card.Content>
                {renderPicker("Type vehicule *", "id_type_vehicule", catList, "nom_cat", "id_cat_vehicule")}
                {renderPicker("Motif *", "id_motif", motifList, "nom_motif_demande", "id_motif_demande")}
                {renderPicker("Service Demandeur *", "id_demandeur", serviceList, "nom_service", "id_service_demandeur")}
                {renderPicker("Client", "id_client", clientList, "nom", "id_client")}
                {renderPicker("Destination", "id_destination", destinationList, "nom_destination", "id_destination")}

                <Text style={styles.label}>Personnes à bord</Text>
                <TextInput
                  mode="outlined"
                  placeholder="Saisir les noms"
                  value={form.personne_bord}
                  onChangeText={(val) => handleChange("personne_bord", val)}
                  style={styles.input}
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loadingData}
                  disabled={loadingData}
                  style={styles.button}
                >
                  Soumettre
                </Button>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReservationForm;

const styles = StyleSheet.create({
  backButton: {
  marginBottom: 16,
  marginTop: 10,
  paddingLeft: 4,
  alignSelf: "flex-start",
},
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 24,
  },
  inner: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  field: {
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  card: {
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
    marginBottom: 50
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
  },
});
