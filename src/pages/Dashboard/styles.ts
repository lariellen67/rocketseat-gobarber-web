import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

const growInDay = keyframes`
  0% {
    opacity: 0.5;
    transform: scale(0.5)
  }

  50% {
    opacity: 1;
    transform: scale(1.2)
  }

  100% {
    opacity: 1;
    transform: scale(1)
  }
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-300px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const Container = styled.div``;

export const Header = styled.header`
  padding: 32px;
  background: #28262e;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 80px;
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    a {
      text-decoration: none;
      color: #ff9000;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;
  display: flex;
`;

export const Schedule = styled.div`
  flex: 1;
  margin-right: 120px;

  h1 {
    font-size: 36px;
  }

  p {
    margin-top: 8px;
    color: #ff9000;
    display: flex;
    align-items: center;
    font-weight: 500;

    span {
      display: flex;
      align-items: center;
    }

    span + span::before {
      content: '';
      width: 1px;
      height: 12px;
      background: #ff9000;
      margin: 0 8px;
    }
  }
`;

export const NextAppointment = styled.div`
  margin-top: 64px;

  > strong {
    color: #999591;
    font-size: 20px;
    font-weight: 400px;
  }

  div {
    background: #3e3b47;
    display: flex;
    align-items: center;
    padding: 16px 24px;
    border-radius: 10px;
    margin-top: 24px;
    position: relative; /** Por causa da bordinha laranja */

    &::before {
      position: absolute;
      height: 80%;
      width: 1px;
      left: 0;
      top: 10%;
      content: '';
      background: #ff9000;
    }

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    strong {
      margin-left: 24px;
      color: #fff;
    }

    span {
      margin-left: auto;
      display: flex;
      align-items: center;
      color: #999591;

      svg {
        color: #ff9000;
        margin-right: 8px;
      }
    }
  }
`;

export const Section = styled.section`
  margin-top: 48px;

  > strong {
    color: #999591;
    font-size: 20px;
    line-height: 26px;
    border-bottom: 1px solid #3e3b47;
    display: block;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  > p {
    color: #999591;
  }
`;

export const Appointment = styled.div`
  display: flex;
  align-items: center;
  /* animation: ${appearFromLeft} 1s; */

  /* &:nth-child(2) {
    animation-delay: 0s;
  }

  &:nth-child(3) {
    animation-delay: 0.5s;
  }

  &:nth-child(4) {
    animation-delay: 1s;
  }

  &:nth-child(5) {
    animation-delay: 1.5s;
  }

  &:nth-child(6) {
    animation-delay: 2s;
  }

  &:nth-child(7) {
    animation-delay: 2.5s;
  }

  &:nth-child(8) {
    animation-delay: 3s;
  } */

  /**Vai colocar um margin-top, somente se tiver uma div Appointment depois de uma div Appointment, ou seja, 1-divAppointment sem margin-top, 2-divAppointment com margin-top, 3-divAppointment com margin-top e assim por diante  */
  & + div {
    margin-top: 16px;
  }

  span {
    margin-left: auto;
    display: flex;
    align-items: center;
    color: #f4ede8;
    width: 70px;

    svg {
      color: #ff9000;
      margin-right: 8px;
    }
  }

  div {
    flex: 1;
    background: #3e3b47;
    display: flex;
    align-items: center;
    padding: 16px 24px;
    border-radius: 10px;
    margin-left: 24px;

    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }

    strong {
      margin-left: 24px;
      color: #fff;
      font-size: 20px;
    }
  }
`;

export const Calendar = styled.aside`
  width: 380px;

  .DayPicker {
    background: #28262e;
    border-radius: 10px;
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px;
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #3e3b47;
    border-radius: 10px;
    color: #fff;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside):not(.DayPicker-Day--disabled):not(.DayPicker--interactionDisabled) {
    background: #3e3b47;
    border-radius: 10px;
    color: #fff;
    animation: ${growInDay} 0.8s;

    &:nth-child(2) {
      animation-delay: 0s;
    }

    &:nth-child(3) {
      animation-delay: 0.1s;
    }

    &:nth-child(4) {
      animation-delay: 0.12s;
    }

    &:nth-child(5) {
      animation-delay: 0.13s;
    }

    &:nth-child(6) {
      animation-delay: 0.14s;
    }
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
    transition: transform 0.1s ease-in-out;

    &:hover {
      background: ${shade(0.2, '#3e3b47')};
      transform: scale(1.2);
    }
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: #ff9000 !important;
    border-radius: 10px;
    color: #232129 !important;
  }
`;
