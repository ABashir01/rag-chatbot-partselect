import React from "react";
import { Box, Text, Group, Menu, Input, ActionIcon, Image, rem, Stack } from "@mantine/core";
import { IconSearch, IconChevronDown, IconShoppingCart, IconUserCircle, IconBox, IconTruck, IconFlag, IconAward, IconReceiptRefund } from "@tabler/icons-react";


const HeaderComponent = () => {
  return (
    <Box
      style={{
        width: "100%",
        height: "90%",
        backgroundColor: "#ffffff",
        paddingLeft: 0,
        marginBottom: '1px',
      }}
    >
      {/* Top Row */}
      <Group justify="space-between" px="md" py="xs" style={{ borderBottom: "1px solid #e0e0e0", paddingLeft: '0' }}>
        {/* Left Side: Logo */}
          <Image
            src="https://partselectcom-gtcdcddbene3cpes.z01.azurefd.net/images/ps-25-year-logo.svg"
            alt="PartSelect Logo"
            height={50}
            width={100}
          />
        
        {/* Right Side: Account & Cart */}
        <Group gap={'xl'} style={{width: '50%', justifyContent: 'space-between'}}>
        <Stack align="center" gap={'0px'}>
          <Text fw={700} size="xl">
            1-866-319-8402
          </Text>
          <Text size="xs">
            Monday to Saturday
          </Text>
          <Text size="xs">
            8am - 9pm EST
          </Text>
        </Stack>
        <Group gap={'0px'} style={{ cursor: "pointer" }}>
            <IconBox style={{ fill: 'black', stroke: 'white' }} />
            <Text size="md" style={{ cursor: "pointer", fontWeight: 700 }}>
            Order Status
            </Text>
        </Group>
          <Group gap={'0px'} style={{ cursor: "pointer" }}>
            <IconUserCircle size={20} />
            <Text size="md" fw={700}>
              Your Account
            </Text>
            <IconChevronDown size={16} />
          </Group>
          <IconShoppingCart size={45} fill="black" stroke={'0.5'} style={{ cursor: "pointer" }} />
        </Group>
      </Group>

      {/* Bottom Row: Navigation Menu */}
      <Group
        justify="space-between"
        px="md"
        py="xs"
        style={{ backgroundColor: "#337778", color: "#ffffff" }}
      >
        {/* Navigation Menu */}
        <Group gap={"lg"}>
          <Menu>
            <Menu.Target>
              <Text size="sm" style={{ cursor: "pointer", fontWeight: 700}}>
                Find by Brand <IconChevronDown size={16} style={{ verticalAlign: "middle" }} />
              </Text>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Brand 1</Menu.Item>
              <Menu.Item>Brand 2</Menu.Item>
              <Menu.Item>Brand 3</Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Menu>
            <Menu.Target>
              <Text size="sm" style={{ cursor: "pointer", fontWeight: 700 }}>
                Find by Product <IconChevronDown size={16} style={{ verticalAlign: "middle" }} />
              </Text>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Product 1</Menu.Item>
              <Menu.Item>Product 2</Menu.Item>
              <Menu.Item>Product 3</Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Text size="sm" style={{ cursor: "pointer", fontWeight: 700 }}>
            Find by Symptom
          </Text>
          <Text size="sm" style={{ cursor: "pointer", fontWeight: 700 }}>
            Contact
          </Text>
          <Text size="sm" style={{ cursor: "pointer", fontWeight: 700 }}>
            Blog
          </Text>
          <Text size="sm" style={{ cursor: "pointer", fontWeight: 700}}>
            Repair Help
          </Text>
          <Text size="sm" style={{ cursor: "pointer", fontWeight: 700 }}>
            Water Filters
          </Text>
        </Group>

        {/* Search Bar */}
        <Input
          placeholder="Search model or part number"
          color="#121212"
          rightSection={<IconSearch size={25} color="#337778"/>}
          style={{ width: rem(300), color: "#121212" }}
        />
      </Group>

      {/* Footer Row */}
      <Group align="center" justify="center" py="xs">
        <Group gap={'0px'}>
            <IconTruck size={20} />
            <Text size="sm" fw={700}>Same-day Shipping</Text>
        </Group>
        <Group gap={'0px'}>
            <IconFlag size={20} />
            <Text size="sm" fw={700}>Ships from USA</Text>
        </Group>
        <Group gap={'0px'}>
            <IconAward size={20} />
            <Text size="sm" fw={700}>1 Year Warranty</Text>
        </Group>
        <Group gap={'0px'}>
            <IconReceiptRefund size={20} />
            <Text size="sm" fw={700}>365 Day Returns</Text>
        </Group>
      </Group>
    </Box>
  );
};

export default HeaderComponent;
