import React, { useState } from "react";
import { ChakraProvider, Box, Text, Input, Button, Image, VStack, HStack, useToast } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [colorHex, setColorHex] = useState("");
  const [colorInfo, setColorInfo] = useState(null);
  const toast = useToast();

  const handleSearch = async () => {
    if (!colorHex.match(/^[0-9A-Fa-f]{6}$/)) {
      toast({
        title: "Invalid hex code.",
        description: "Please enter a valid hex color code (6 characters, no #).",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`https://api.color.pizza/v1/${colorHex}`);
      const data = await response.json();

      if (data.colors && data.colors.length > 0) {
        setColorInfo(data.colors[0]);
      } else {
        setColorInfo(null);
        toast({
          title: "Color not found.",
          description: "No color found for the provided hex code.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to fetch color information.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box p={8}>
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Color Name Finder
          </Text>
          <HStack>
            <Input placeholder="Enter hex code (e.g. 1B2B34)" value={colorHex} onChange={(e) => setColorHex(e.target.value)} />
            <Button leftIcon={<FaSearch />} colorScheme="blue" onClick={handleSearch}>
              Search
            </Button>
          </HStack>
          {colorInfo && (
            <VStack spacing={2}>
              <Text fontSize="xl" fontWeight="semibold">
                {colorInfo.name}
              </Text>
              <Text>
                RGB: {colorInfo.rgb.r}, {colorInfo.rgb.g}, {colorInfo.rgb.b}
              </Text>
              <Image src={`https://api.color.pizza/v1/swatch/${colorHex}`} alt={`Color swatch for ${colorInfo.name}`} />
            </VStack>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
