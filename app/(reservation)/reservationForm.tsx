import {
  getCatVehicule,
  getDestination,
  getMotif,
  getServiceDemandeur,
  postDemandeVehicule
} from "@/services/charroiService";
import { getClient } from "@/services/clientService";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Button, Card, TextInput, Title } from "react-native-paper";
import Toast from 'react-native-toast-message';
import { useSelector } from "react-redux";

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
  id_motif_demande: number | null;
  id_demandeur: number | null;
  id_client: number | null;
  id_destination: number | null;
  personne_bord: string;
  id_type_vehicule: number | null;
}

type PickerState = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
} | null;

const ReservationForm: React.FC = () => {
  const [loadingData, setLoadingData] = useState(false);
  const userId = useSelector((state: any) => state.auth?.currentUser?.id_utilisateur);
  const [catList, setCatList] = useState<TypeVehicule[]>([]);
  const [motifList, setMotifList] = useState<Motif[]>([]);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [destinationList, setDestinationList] = useState<Destination[]>([]);
  const [clientList, setClientList] = useState<Client[]>([]);
  const [dateChargement, setDateChargement] = useState<Date | null>(null);
  const [datePrevue, setDatePrevue] = useState<Date | null>(null);
  const [dateRetour, setDateRetour] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<PickerState>(null);

  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    id_vehicule: null,
    id_motif_demande: null,
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
        catData,
        serviceData,
        motifData,
        destinationData,
        clientData,
      ] = await Promise.all([
        getCatVehicule(),
        getServiceDemandeur(),
        getMotif(),
        getDestination(),
        getClient(),
      ]);
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

const handleSubmit = () => {
  if (!form.id_motif_demande || !form.id_demandeur) {
    Alert.alert("Champs requis", "Veuillez remplir tous les champs obligatoires (*)");
    return;
  }

  Alert.alert(
    "Confirmation",
    "Voulez-vous vraiment envoyer cette demande ?",
    [
      {
        text: "Annuler",
        style: "cancel"
      },
      {
        text: "Confirmer",
        onPress: async () => {
          try {
            setLoadingData(true);
            await postDemandeVehicule({
              ...form,
              date_chargement: dateChargement,
              date_prevue: datePrevue,
              date_retour: dateRetour,
              user_cr: userId
            });

            Toast.show({
              type: 'success',
              text1: 'Succès',
              text2: 'La demande a été envoyée avec succès 🎉',
              position: 'top'
            });

            setForm({
              id_vehicule: null,
              id_motif_demande: null,
              id_demandeur: null,
              id_client: null,
              id_destination: null,
              personne_bord: "",
              id_type_vehicule: null
            });

            setDateChargement(null);
            setDatePrevue(null);
            setDateRetour(null);
            router.push('/(tabs)/home');
            fetchDatas();

          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Erreur',
              text2: "Échec lors de l'enregistrement.",
              position: 'top'
            });
          } finally {
            setLoadingData(false);
          }
        }
      }
    ]
  );
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

const openPicker = (
  label: string,
  value: Date | null,
  onChange: (date: Date) => void
) => {
  const initialDate = value || new Date();

  if (Platform.OS === 'android') {
    // D'abord on ouvre le date picker
    DateTimePickerAndroid.open({
      value: initialDate,
      mode: 'date',
      is24Hour: true,
      display: 'default',
      onChange: (_event, selectedDate) => {
        if (selectedDate) {
          // Ensuite, on ouvre le time picker
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: 'time',
            is24Hour: true,
            display: 'default',
            onChange: (_evt, selectedTime) => {
              if (selectedTime) {
                const finalDate = new Date(selectedDate);
                finalDate.setHours(selectedTime.getHours());
                finalDate.setMinutes(selectedTime.getMinutes());
                onChange(finalDate);
              }
            },
          });
        }
      },
    });
  } else {
    setShowPicker({ label, value, onChange });
  }
};

const renderDateTimePicker = (
    label: string,
    value: Date | null,
    onChange: (date: Date) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Button
        mode="outlined"
        onPress={() => openPicker(label, value, onChange)}
        style={{ borderRadius: 0, borderColor: '#ccc' }}
      >
        <Text style={{ color: '#555' }}>
          {value ? value.toLocaleString() : 'Choisir la date et l\'heure'}
        </Text>
      </Button>
    </View>
  );


  return (
      <>
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

                {renderDateTimePicker("Date & heure de chargement", dateChargement, setDateChargement)}
                {renderDateTimePicker("Date & heure de départ prévue", datePrevue, setDatePrevue)}
                {renderDateTimePicker("Date & heure de retour prévue", dateRetour, setDateRetour)}

                {renderPicker("Type véhicule *", "id_type_vehicule", catList, "nom_cat", "id_cat_vehicule")}
                {renderPicker("Motif *", "id_motif_demande", motifList, "nom_motif_demande", "id_motif_demande")}
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
      {showPicker && (
          <DateTimePicker
            value={showPicker.value || new Date()}
            mode="datetime"
            {...(Platform.OS === "android" ? { is24Hour: true } : {})}
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                showPicker.onChange(selectedDate);
              }
              setShowPicker(null);
            }}
            display="default"
          />
        )}
    </>
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
