import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: {
    find: jest.Mock;
    findOne: jest.Mock;
    delete: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
      create: jest.fn((data) => data),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', name: 'John', age: 30 },
        { id: '2', name: 'Jane', age: 25 },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findWithFilter', () => {
    it('should build correct query with minAge', async () => {
      const expected = [{ name: 'Ana', age: 30 }];
      mockUserRepository.find.mockResolvedValue(expected);
  
      const result = await service.findWithFilter({ minAge: 30 }, 5, 0);
  
      expect(result).toEqual(expected);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        where: { age: expect.any(Object) },
        take: 5,
        skip: 0,
      });
    });
  });
  

  describe('create', () => {
    it('should create and return a user', async () => {
      const input = { name: 'Alice', age: 32 };
      const mockUser = { id: 'abc-123', ...input };

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(input.name, input.age);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(input);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const existingUser = { id: '1', name: 'Old', age: 20 };
      const updated = { id: '1', name: 'New', age: 22 };
      const input = { name: 'New', age: 22 };
  
      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updated);
  
      const result = await service.update('1', input);
      expect(result).toEqual(updated);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockUserRepository.save).toHaveBeenCalledWith({ ...existingUser, ...input });
    });
  
    it('should throw if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);
  
      await expect(service.update('nonexistent-id', { name: 'Ghost' })).rejects.toThrow('User with ID nonexistent-id not found');
    });
  });

  describe('delete', () => {
    it('should return true when user is deleted', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete('1');
      expect(result).toBe(true);
      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should return false when user is not deleted', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.delete('not-found');
      expect(result).toBe(false);
    });
  });
  

  describe('seedUsers', () => {
    it('should generate N users if count is provided', async () => {
      const count = 10;

      mockUserRepository.create.mockImplementation((data) => data);
      mockUserRepository.save.mockImplementation((users) => users);

      const result = await service.seedUsers(count);

      expect(mockUserRepository.create).toHaveBeenCalledTimes(count);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);

      const savedUsers = mockUserRepository.save.mock.calls[0][0];
      expect(Array.isArray(savedUsers)).toBe(true);
      expect(savedUsers.length).toBe(count);
      expect(result.length).toBe(count);

      for (const user of savedUsers) {
        expect(user).toHaveProperty('name');
        expect(typeof user.name).toBe('string');

        expect(user).toHaveProperty('age');
        expect(typeof user.age).toBe('number');
        expect(user.age).toBeGreaterThanOrEqual(18);
        expect(user.age).toBeLessThanOrEqual(70);
      }
    });

    it('should default to 1000 users if no count is passed', async () => {
      mockUserRepository.create.mockImplementation((data) => data);
      mockUserRepository.save.mockImplementation((users) => users);

      const result = await service.seedUsers();

      expect(mockUserRepository.create).toHaveBeenCalledTimes(1000);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);

      const savedUsers = mockUserRepository.save.mock.calls[0][0];
      expect(Array.isArray(savedUsers)).toBe(true);
      expect(savedUsers.length).toBe(1000);
      expect(result.length).toBe(1000);

      for (const user of savedUsers) {
        expect(user).toHaveProperty('name');
        expect(typeof user.name).toBe('string');

        expect(user).toHaveProperty('age');
        expect(typeof user.age).toBe('number');
        expect(user.age).toBeGreaterThanOrEqual(18);
        expect(user.age).toBeLessThanOrEqual(70);
      }
    });
  });
});
