import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult, MongoEntityManager } from 'typeorm';
import { Injectable, CACHE_MANAGER, HttpException } from '@nestjs/common';
// import { AppointmentEntity } from './appointment.entity';
import { ProgramEntity } from '../program/program.entity';
import { CustomCriterium } from '../program/custom-criterium.entity';
import { CreateAvailabilityDto } from './dto';
import { AvailabilityEntity } from './availability.entity';
import { UserEntity } from '../user/user.entity';
import { AppointmentEntity } from './appointment.entity';

@Injectable()
export class AppointmentService {
    
  @InjectRepository(AvailabilityEntity)
  private readonly availabilityRepository: Repository<AvailabilityEntity>;
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;
  @InjectRepository(ProgramEntity)
  private readonly programRepository: Repository<ProgramEntity>;
  @InjectRepository(AppointmentEntity)
  private readonly appointmentRepository: Repository<AppointmentEntity>;

  public constructor() {}

  public async postAvailability(userId: number, 
    availabilityData: CreateAvailabilityDto): Promise<AvailabilityEntity> {
      let availability = new AvailabilityEntity();
      availability.startDate = availabilityData.startDate;
      availability.endDate = availabilityData.endDate;
      availability.location = availabilityData.location;
  
      const aidworker = await this.userRepository.findOne(userId);
      availability.aidworker = aidworker;
  
      const newAvailability = await this.availabilityRepository.save(availability);
  
      return newAvailability;
  }

  public async getAvailability(programId: number): Promise<AvailabilityEntity[]> {
    const program = await this.programRepository.findOne(programId);
    if (!program) {
      const errors = { Program: ' not found' };
      throw new HttpException({ errors }, 401);
    }
    let aidworkers = await this.userRepository.find({where: {assigned_program: {id: programId}}});
    if (aidworkers.length == 0) {
      const errors = { Message: 'No aidworkers assigned to this program yet.' };
      throw new HttpException({ errors }, 401);
    }
    let availabilities = [];
    for (let index in aidworkers) {
      availabilities.push(await this.availabilityRepository.find({where: {aidworker: {id: aidworkers[index].id}}}));
    }
    if (availabilities.length == 0) {
      const errors = { Message: 'No available time-windows posted yet.' };
      throw new HttpException({ errors }, 401);
    }
    return availabilities;
  }

  public async registerTimeslot(timeslotId: number): Promise<AppointmentEntity> {
    let appointment = new AppointmentEntity();
    appointment.timeslotId = timeslotId;
    const newAppointment = await this.appointmentRepository.save(appointment);
    return newAppointment;
  }

  public async getAppointments(userId: number): Promise<AppointmentEntity[]> {
    let user = await this.userRepository.findOne(userId);
    let timeslots = await this.availabilityRepository.find({where: {aidworker: {id: user.id}}});
    let appointments = [];
    for (let index in timeslots){
      appointments.push(await this.appointmentRepository.find({where: {timeslotId: timeslots[index].id}}));
    }
    return appointments;
  }


  
}