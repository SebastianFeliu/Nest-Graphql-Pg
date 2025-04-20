import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserFilterInput, CreateUserInput, UpdateUserInput } from './dto';


describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: jest.Mocked<UserService>;

  const mockUsers = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ];

  const mockUser = { name: 'Charlie', age: 40 };

  beforeEach(async () => {
    const mockUserService: Partial<jest.Mocked<UserService>> = {
      findWithFilter: jest.fn().mockResolvedValue(mockUsers),
      create: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue({ name: 'Updated', age: 50 }),
      delete: jest.fn().mockResolvedValue(true),
      seedUsers: jest.fn().mockResolvedValue(mockUsers),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('users()', () => {
    it('should return users with filters and pagination', async () => {
      const filter: UserFilterInput = { minAge: 20 };
      const result = await resolver.users(filter, 10, 0);
      expect(result).toEqual(mockUsers);
      expect(userService.findWithFilter).toHaveBeenCalledWith(filter, 10, 0);
    });

    it('should return users with default params if none provided', async () => {
      await resolver.users(undefined, undefined, undefined);
      expect(userService.findWithFilter).toHaveBeenCalledWith({}, 10, 0);
    });
  });

  describe('createUser()', () => {
    it('should create and return a user', async () => {
      const input: CreateUserInput = { name: 'Charlie', age: 40 };
      const result = await resolver.createUser(input);
      expect(result).toEqual(mockUser);
      expect(userService.create).toHaveBeenCalledWith('Charlie', 40);
    });
  });

  describe('updateUser()', () => {
    it('should update and return the user', async () => {
      const input: UpdateUserInput = { name: 'Updated', age: 50 };
      const result = await resolver.updateUser('1', input);
      expect(result).toEqual({ name: 'Updated', age: 50 });
      expect(userService.update).toHaveBeenCalledWith('1', input);
    });
  });

  describe('deleteUser()', () => {
    it('should delete and return true', async () => {
      const result = await resolver.deleteUser('1');
      expect(result).toBe(true);
      expect(userService.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('seedUsers()', () => {
    it('should seed users with provided count', async () => {
      const result = await resolver.seedUsers(10);
      expect(result).toEqual(mockUsers);
      expect(userService.seedUsers).toHaveBeenCalledWith(10);
    });

    it('should seed 1000 users by default if no count is provided', async () => {
      await resolver.seedUsers();
      expect(userService.seedUsers).toHaveBeenCalledWith(1000);
    });
  });
});
