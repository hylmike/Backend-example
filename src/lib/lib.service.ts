import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';

import { Lib, LibDocument } from '../mongoSchema/lib.schema';
import { ChangePwdInput, RegLibInput, UpdateLibInput } from '../graphql';

@Injectable()
export class LibService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel('Lib') private libModel: Model<LibDocument>,
  ) {}

  //Register new librarian/admin into database
  async register(registerLibDto: RegLibInput) {
    const username = registerLibDto.username.trim();
    const role =
      registerLibDto.role.toLowerCase() === 'admin' ? 'admin' : 'librarian';
    if (username === '') {
      this.logger.warn('Username or form is empty, register failed');
      return null;
    } else if (await this.libModel.findOne({ username })) {
      this.logger.warn(
        `The username ${username} exists, ${role} register failed`,
      );
      return null;
    } else if (registerLibDto.password !== registerLibDto.confirmPassword) {
      this.logger.warn(
        `Passwords mismatched, register ${role} ${username} failed`,
      );
      return null;
    }
    //encrypt password before saving into database
    const hash = await bcrypt.hash(registerLibDto.confirmPassword, 10);
    const newLib = new this.libModel({
      username: registerLibDto.username,
      password: hash,
      email: registerLibDto.email,
      role: registerLibDto.role,
      firstName: registerLibDto.firstName,
      lastName: registerLibDto.lastName,
      phoneNumber: registerLibDto.phoneNumber,
      registerDate: new Date(),
    });
    try {
      const lib = await newLib.save();
      //create the log for this activity
      this.logger.info(`Success register ${lib.role} ${lib.username}`);
      return lib;
    } catch (err) {
      this.logger.error(
        `Saving new ${role} ${newLib.username} into database failed: ${err}`,
      );
      return null;
    }
  }

  //Get all admin from database
  async getAllAdmin() {
    const adminList = await this.libModel.find({ role: 'Admin' });
    if (adminList) {
      this.logger.info('Success get admin list from database');
      return adminList;
    }
    this.logger.warn("Can't get admin list from database");
    return null;
  }

  async getAllLibrarian() {
    const libList = await this.libModel.find({ role: 'Librarian' });
    if (libList) {
      this.logger.info('Success get librarian list from database');
      return libList;
    }
    this.logger.warn("Can't get librarian list from database");
    return null;
  }

  //Get librarian/admin profile from database
  async getProfile(libID): Promise<Lib | undefined> {
    const lib = await this.libModel.findById(libID);
    if (!lib) {
      this.logger.warn(`Librarian ${libID} does not exist, get profile failed`);
      return null;
    }
    //create log for this activity
    this.logger.info(`Success get ${lib.role} ${lib.username} profile`);
    return lib;
  }

  //Update librarian/admin profile based on inputs and save into database
  async updateProfile(updateLibDto: UpdateLibInput) {
    const lib = await this.libModel.findOne({
      username: updateLibDto.username,
    });
    if (!lib) {
      this.logger.warn(
        `Can not find the librarian ${updateLibDto.username} in updateProfile module`,
      );
      return null;
    }
    for (const item in updateLibDto) {
      switch (item) {
        case 'username':
          break;
        case 'isActive':
          const value =
            updateLibDto[item].toLowerCase() === 'active' ? true : false;
          if (value !== lib[item]) lib[item] = value;
          break;
        default:
          if (updateLibDto[item] !== lib[item]) lib[item] = updateLibDto[item];
      }
    }
    try {
      const updatedLib = await lib.save();
      //Create log for this activity
      this.logger.info(
        `Successful update profile of ${lib.role} ${lib.username}`,
      );
      return updatedLib;
    } catch (err) {
      this.logger.error(
        `Saving updated ${lib.role} ${lib.username} into database failed: ${err}`,
      );
      return null;
    }
  }

  //Change password of reader account
  async changePwd(changeLibPwdDto: ChangePwdInput) {
    const lib = await this.libModel
      .findOne({ username: changeLibPwdDto.username })
      .select('+password')
      .exec();
    if (!lib) {
      this.logger.warn(
        `Can not find librarian ${changeLibPwdDto.username} in change password module`,
      );
      return null;
    }
    const match = await bcrypt.compare(
      changeLibPwdDto.currentPwd,
      lib.password,
    );
    if (!match) {
      this.logger.warn(
        `Wrong current password when changing it for ${lib.role} ${lib.username}`,
      );
      return null;
    }
    //Encrypt new password and save it into database
    lib.password = await bcrypt.hash(changeLibPwdDto.newPwd, 10);
    try {
      const newLib = await lib.save();
      //Create log for this activity
      this.logger.info(
        `Success changed the password for ${newLib.role} ${newLib.username}`,
      );
      return newLib;
    } catch (err) {
      this.logger.error(
        `Saving ${lib.role} ${lib.username} failed when updating password: ${err}`,
      );
      return null;
    }
  }

  async delLib(libID: string) {
    const lib = await this.libModel.findByIdAndRemove(libID);
    if (lib) {
      this.logger.info(`Success delete lib ${libID}`);
      return lib;
    } else {
      this.logger.warn(`Falied to delete lib ${libID}`);
      return null;
    }
  }

  async checkAdmin(libID): Promise<boolean> {
    const lib = await this.libModel.findById(libID);
    if (lib && lib.role.toLowerCase() == 'admin') {
      this.logger.info(`ChecnAdmin success`);
      return true;
    } else if (!lib) {
      this.logger.warn(`Can't find ${libID} in database, checnAdmin failed`);
      return null;
    }
    this.logger.info(`ChecnAdmin success`);
    return false;
  }
}
