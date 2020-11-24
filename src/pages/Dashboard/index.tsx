import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isToday, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import {
  Container,
  HeaderContent,
  Profile,
  Header,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment
} from "./styles";
import api from "../../services/api";
import logoImg from "../../assets/logo.svg";
import { FiClock, FiPower } from "react-icons/fi";
import { useAuth } from "../../hooks/auth";

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string,
  date: string,
  user: {
    name: string,
    avatar_url: string,
  }
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { signOut, user } = useAuth();
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      }
    }).then((response) => {
      setMonthAvailability(response.data);
    });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api.get("/appointments/me", {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    }).then((response) => {
      setAppointments(response.data);
      console.log(response.data);
    });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability.filter(monthDay => monthDay.available === false).map((monthDay) => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      return new Date(year, month, monthDay.day);
    })
    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, "cccc", { locale: ptBR });
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt={logoImg} />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />

            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
          {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://avatars0.githubusercontent.com/u/59733804?s=460&u=78dd6fbf6e7d045a1278f11314c34ea0d8f82317&v=4"
                alt="Leandro Martins"
              />
              <strong>Leandro Martins</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/59733804?s=460&u=78dd6fbf6e7d045a1278f11314c34ea0d8f82317&v=4"
                  alt="Leandro Martins"
                />
                <strong>Leandro Martins</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/59733804?s=460&u=78dd6fbf6e7d045a1278f11314c34ea0d8f82317&v=4"
                  alt="Leandro Martins"
                />
                <strong>Leandro Martins</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars0.githubusercontent.com/u/59733804?s=460&u=78dd6fbf6e7d045a1278f11314c34ea0d8f82317&v=4"
                  alt="Leandro Martins"
                />
                <strong>Leandro Martins</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[
              { daysOfWeek: [0, 6] }, ...disabledDays
            ]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] }
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
            months={[
              'Janeiro',
              'Fevereiro',
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro"
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
